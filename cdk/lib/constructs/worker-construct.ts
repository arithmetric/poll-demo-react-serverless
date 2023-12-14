import { StackProps} from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

interface WorkerConstructProps extends StackProps {
  Queue: Queue;
  Table: Table;
}

export class WorkerConstruct extends Construct {
  lambdaFunction: IFunction;

  constructor(scope: Construct, id: string, props: WorkerConstructProps) {
    super(scope, id);

    // Lambda
    this.lambdaFunction = new Function(this, "WorkerFunction", {
      runtime: Runtime.NODEJS_18_X,
      handler: "lambda-worker.handler",
      code: Code.fromAsset("../backend/build.zip"),
      environment: {
        TABLE_NAME: props.Table.tableName,
      },
    });
    this.lambdaFunction.addEventSource(new SqsEventSource(props.Queue));
    props.Table.grantReadWriteData(this.lambdaFunction);
  }
}
