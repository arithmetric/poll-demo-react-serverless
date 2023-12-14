import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import { ApiConstruct } from "./constructs/api-construct";
import { DataConstruct } from "./constructs/data-construct";
import { DnsConstruct } from "./constructs/dns-construct";
import { MonitorConstruct } from "./constructs/monitor-construct";
import { WebappConstruct } from "./constructs/webapp-construct";
import { WorkerConstruct } from "./constructs/worker-construct";

export class PlatformStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dns = new DnsConstruct(this, "PlatformDns");

    const data = new DataConstruct(this, "PlatformData");

    const worker = new WorkerConstruct(this, "PlatformWorker", {
      Queue: data.queue,
      Table: data.table,
    });

    const api = new ApiConstruct(this, "PlatformApi", {
      DnsZone: dns.dnsZone,
      Queue: data.queue,
      SslCertificate: dns.sslCert,
      Table: data.table,
    });

    new WebappConstruct(this, "PlatformWebApp", {
      DnsZone: dns.dnsZone,
      SslCertificate: dns.sslCert,
    });

    new MonitorConstruct(this, "PlatformMonitor", {
      FunctionApi: api.lambdaFunction,
      FunctionWorker: worker.lambdaFunction,
    });
  }
}
