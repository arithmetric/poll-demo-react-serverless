import { StackProps} from "aws-cdk-lib";
import { Alarm, ComparisonOperator, TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface MonitorConstructProps extends StackProps {
  FunctionApi: IFunction;
  FunctionWorker: IFunction;
}

export class MonitorConstruct extends Construct {
  constructor(scope: Construct, id: string, props: MonitorConstructProps) {
    super(scope, id);
    
    new Alarm(this, "Monitor-Lambda-API-Errors", {
      alarmDescription: "Too many Lambda errors for the API",
      metric: props.FunctionApi.metricErrors(),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 5,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    new Alarm(this, "Monitor-Lambda-API-Invocations", {
      alarmDescription: "Too many Lambda invocations for the API",
      metric: props.FunctionApi.metricInvocations(),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 100,
      evaluationPeriods: 3,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    new Alarm(this, "Monitor-Lambda-Worker-Errors", {
      alarmDescription: "Too many Lambda errors for the Worker",
      metric: props.FunctionWorker.metricErrors(),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 3,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    new Alarm(this, "Monitor-Lambda-Worker-Invocations", {
      alarmDescription: "Too many Lambda invocations for the Worker",
      metric: props.FunctionWorker.metricInvocations(),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 10,
      evaluationPeriods: 3,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });
  }
}
