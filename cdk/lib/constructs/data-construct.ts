import { CfnOutput, Duration } from "aws-cdk-lib";
import { AttributeType, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export class DataConstruct extends Construct {
  dlq: Queue;
  queue: Queue;
  table: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // DynamoDB Table
    this.table = new Table(this, "DataTable", {
      partitionKey: { name: "Id", type: AttributeType.STRING },
      encryption: TableEncryption.AWS_MANAGED,
    });

    // SQS Queue for DLQ
    this.dlq = new Queue(this, "DataQueueDeadLetter", {
      encryption: QueueEncryption.SQS_MANAGED,
      enforceSSL: true,
      retentionPeriod: Duration.days(14),
    });

    // SQS Queue
    this.queue = new Queue(this, "DataQueue", {
      encryption: QueueEncryption.SQS_MANAGED,
      enforceSSL: true,
      retentionPeriod: Duration.days(7),
    });

    // Exports
    new CfnOutput(this, "ExportDataTableArn", {
      value: this.table.tableArn,
    });
    new CfnOutput(this, "ExportDataTableName", {
      value: this.table.tableName,
    });
    new CfnOutput(this, "ExportDataQueueArn", {
      value: this.queue.queueArn,
    });
    new CfnOutput(this, "ExportDataQueueName", {
      value: this.queue.queueName,
    });
  }
}
