import * as AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { TestLambda, TestEvent } from '../src/TestLambda';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { expect } from 'chai';
import { FlowRequestMessage } from '../src/FlowMessage';

describe('Test TestLambda', () => {

    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore('SQS');
    });

    it('handles test invoke', async () => {

        const actualSendMessageRequests = new Array<SendMessageRequest>();

        AWSMock.mock('SQS', 'sendMessage', (params: SendMessageRequest, callback: Function) => {            
            actualSendMessageRequests.push(params);
            callback(null, {
                MessageId: 'MessageId'
            });
        });

        const sqsClient = new AWS.SQS;
        
        const queueUrl = 'queueUrl';
        const functionName = 'functionName';
        const testLambda = new TestLambda(functionName, sqsClient, queueUrl);

        const testEvent: TestEvent = {
            correlationId: 'correlationId',
            requestId: 'requestId',
            request: {
                any: 'old',
                rubbish: true
            }
        };

        console.log(`testEvent: ${JSON.stringify(testEvent)}`);

        await testLambda.handle(testEvent);
        
        expect(actualSendMessageRequests.length).to.equal(1);
        expect(actualSendMessageRequests[0].QueueUrl).to.equal(queueUrl);

        const actualRequestMessage: FlowRequestMessage = JSON.parse(actualSendMessageRequests[0].MessageBody);

        expect(actualRequestMessage.callContext.correlationId).to.equal(testEvent.correlationId);
        expect(actualRequestMessage.requestContext.requestId).to.equal(testEvent.requestId);
        expect(actualRequestMessage.requestContext.functionName).to.equal(functionName);
        expect(actualRequestMessage.request).to.deep.equal(testEvent.request);
    });
});