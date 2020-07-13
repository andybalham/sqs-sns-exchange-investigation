import { TestLambda } from './TestLambda';
import { TargetLambda } from './TargetLambda';
import { SNS } from 'aws-sdk';

const testLambda = new TestLambda();

export const handleTest = async (event: any): Promise<any> => {
    return await testLambda.handle(event);
};

const snsClient = new SNS;
const targetLambda = new TargetLambda(snsClient, process.env.RESPONSE_TOPIC ?? 'undefined');

export const handleTarget = async (event: any): Promise<any> => {
    return await targetLambda.handle(event);
};