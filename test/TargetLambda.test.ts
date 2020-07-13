import { handleTarget } from '../src/lambda';
import * as exampleSQSEvent from './ExampleSQSEvent.json';
import { expect } from 'chai';
import * as AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

describe('Test TargetLambda', () => {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);        
    });

    afterEach(() => {
        AWSMock.restore('SNS');
    });

    it('handles test invoke', async () => {

        const result = await handleTarget(exampleSQSEvent);

        expect(result).to.be.null;
    });
});