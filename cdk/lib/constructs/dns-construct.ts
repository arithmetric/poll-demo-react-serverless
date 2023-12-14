import { CfnOutput, Fn } from "aws-cdk-lib";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export class DnsConstruct extends Construct {
  dnsZone: HostedZone;
  sslCert: Certificate;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    if (!process.env.DOMAIN_NAME || !process.env.WEBAPP_SUBDOMAIN || !process.env.API_SUBDOMAIN) {
      throw new Error("DnsConstruct: DOMAIN_NAME, API_SUBDOMAIN, and WEBAPP_SUBDOMAIN must be defined.");
    }

    // Route53 Zone
    this.dnsZone = new HostedZone(this, "DnsZone", {
      zoneName: process.env.DOMAIN_NAME,
    });

    // Certificate Manager SSL Cert
    this.sslCert = new Certificate(this, "DnsCertificate", {
      domainName: process.env.DOMAIN_NAME,
      subjectAlternativeNames: [
        `${process.env.WEBAPP_SUBDOMAIN}.${process.env.DOMAIN_NAME}`,
        `${process.env.API_SUBDOMAIN}.${process.env.DOMAIN_NAME}`,
      ],
      validation: CertificateValidation.fromDns(this.dnsZone),
    });

    // Exports
    new CfnOutput(this, "ExportDnsHostedZoneId", {
      value: this.dnsZone.hostedZoneId,
    });
    new CfnOutput(this, "ExportDnsHostedZoneNameServers", {
      value: Fn.join("\n", this.dnsZone?.hostedZoneNameServers || []),
    });
    new CfnOutput(this, "ExportDnsCertificateArn", {
      value: this.sslCert.certificateArn,
    });
  }
}
