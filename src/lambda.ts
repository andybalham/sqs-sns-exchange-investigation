import { TestLambda } from './TestLambda';
import { TargetLambda } from './TargetLambda';
import { SNS, SQS } from 'aws-sdk';

const sqsClient = new SQS;
const testLambda = new TestLambda(process.env.RESPONSE_SUBSCRIPTION_ID ?? 'undefined', sqsClient, process.env.TARGET_FUNCTION_REQUEST_QUEUE_URL ?? 'undefined');

export const handleTest = async (event: any): Promise<any> => {
    return await testLambda.handle(event);
};

const snsClient = new SNS;
const targetLambda = new TargetLambda(snsClient, process.env.RESPONSE_TOPIC ?? 'undefined');

export const handleTarget = async (event: any): Promise<any> => {
    return await targetLambda.handle(event);
};