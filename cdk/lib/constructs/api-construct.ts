import { CfnOutput, StackProps} from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { AllowedMethods, CachePolicy, CachedMethods, Distribution, OriginRequestPolicy, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { RestApiOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface ApiConstructProps extends StackProps {
  DnsZone: HostedZone;
  Queue: Queue;
  SslCertificate: Certificate;
  Table: Table;
}

export class ApiConstruct extends Construct {
  lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    // Lambda
    this.lambdaFunction = new Function(this, "ApiFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: "lambda-api.handler",
      code: Code.fromAsset("../backend/build.zip"),
      environment: {
        QUEUE_URL: props.Queue.queueUrl,
        TABLE_NAME: props.Table.tableName,
      },
    });
    props.Queue.grantSendMessages(this.lambdaFunction);
    props.Table.grantReadWriteData(this.lambdaFunction);

    // API Gateway
    const gateway = new LambdaRestApi(this, "ApiGateway", {
      handler: this.lambdaFunction,
    });

    // CloudFront
    const distribution = new Distribution(this, "ApiDistribution", {
      comment: "API distribution",
      defaultBehavior: {
        origin: new RestApiOrigin(gateway),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: props.SslCertificate,
      domainNames: [`${process.env.API_SUBDOMAIN}.${process.env.DOMAIN_NAME}`],
    });

    // Route53 A Record
    new ARecord(this, "ApiDnsARecord", {
      recordName: process.env.API_SUBDOMAIN,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: props.DnsZone,
    });

    // Exports
    new CfnOutput(this, "ExportApiGatewayDomainName", {
      value: gateway.domainName?.domainName || "",
    });
    new CfnOutput(this, "ExportApiDistributionId", {
      value: distribution.distributionId || "",
    });
    new CfnOutput(this, "ExportApiDistributionDomainName", {
      value: distribution.distributionDomainName || "",
    });
  }
}
