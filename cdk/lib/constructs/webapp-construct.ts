import { join } from "node:path";
import { cwd } from "node:process";

import { CfnOutput, Duration, StackProps } from "aws-cdk-lib";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { AllowedMethods, CachePolicy, Distribution, OriginAccessIdentity, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

interface WebappConstructProps extends StackProps {
  DnsZone: HostedZone;
  SslCertificate: Certificate;
}

export class WebappConstruct extends Construct {
  constructor(scope: Construct, id: string, props: WebappConstructProps) {
    super(scope, id);

    // S3
    const bucket = new Bucket(this, "WebappBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
    });

    // Origin Access Identity to allow CloudFront to read S3
    const originAccessIdentity = new OriginAccessIdentity(this, "WebappOriginAccessIdentity");
    bucket.grantRead(originAccessIdentity);

    // CloudFront
    const distribution = new Distribution(this, "WebappDistribution", {
      comment: "Web App distribution",
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity }),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.days(7),
        }
      ],
      defaultRootObject: "index.html",
      certificate: props.SslCertificate,
      domainNames: [`${process.env.WEBAPP_SUBDOMAIN}.${process.env.DOMAIN_NAME}`],
    });

    // Deploy web app files to S3 bucket and invalidate Cloudfront cache.
    new BucketDeployment(this, "WebappBucketDeployment", {
      destinationBucket: bucket,
      sources: [Source.asset(join(cwd(), "../webapp/dist"))],
      distribution,
    });

    // Route53 A Record
    new ARecord(this, "WebappDnsARecord", {
      recordName: process.env.WEBAPP_SUBDOMAIN,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: props.DnsZone,
    });

    // Exports
    new CfnOutput(this, "ExportWebappDistributionId", {
      value: distribution.distributionId || "",
    });
    new CfnOutput(this, "ExportWebappDistributionDomainName", {
      value: distribution.distributionDomainName || "",
    });
  }
}
