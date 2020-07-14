import * as exampleSQSEvent from './ExampleSQSEvent.json';
import * as expectedSNSResponse from './ExpectedSNSResponse.json';
import * as AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';
import { TargetLambda } from '../src/TargetLambda';
import { expect } from 'chai';

describe('Test TargetLambda', () => {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);        
    });

    afterEach(() => {
        AWSMock.restore('SNS');
    });

    it('handles test invoke', async () => {

        const actualPublishInputs: Array<PublishInput | undefined> = [];

        AWSMock.mock('SNS', 'publish', (params: PublishInput, callback: Function) => {
            actualPublishInputs.push(params);
            callback(null, {
                MessageId: 'MessageId'
            });
        });

        const snsClient = new AWS.SNS;
        const targetLambda = new TargetLambda(snsClient, 'responseTopicArn');
        
        const handleResult = await targetLambda.handle(exampleSQSEvent);
                
        expect(handleResult).to.be.null;

        actualPublishInputs.forEach((actualPublishInput, index) => {
            expect(actualPublishInput, `index=${index}`).deep.equal(expectedSNSResponse[index]);
        });
    });
});