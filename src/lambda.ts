import { TestLambda } from './TestLambda';
import { TargetLambda } from './TargetLambda';

const testLambda = new TestLambda();

export const handleTest = async (event: any): Promise<any> => {
    return await testLambda.handle(event);
};

const targetLambda = new TargetLambda();

export const handleTarget = async (event: any): Promise<any> => {
    return await targetLambda.handle(event);
};