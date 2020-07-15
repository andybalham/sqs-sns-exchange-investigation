import SQS, { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { SNSEvent } from 'aws-lambda';
import { FlowRequestMessage } from './FlowMessage';

export class TestEvent {
    correlationId: string;
    requestId: string;
    request: any;
}

export class TestLambda {
    
    readonly functionName: string;
    readonly sqs: SQS;
    readonly queueUrl: string;

    constructor(functionName: string, sqs: SQS, queueUrl: string) {
        this.functionName = functionName;
        this.sqs = sqs;
        this.queueUrl = queueUrl;
    }

    async handle(event: TestEvent | SNSEvent): Promise<any> {

        if ('Records' in event) {                
            console.log(`event: ${JSON.stringify(event)}`);
            return;
        }

        const message: FlowRequestMessage = {
            callContext: {
                correlationId: event.correlationId
            },
            requestContext: {
                functionName: this.functionName,
                requestId: event.requestId
            },
            request: event.request
        };

        const params: SendMessageRequest = {
            MessageBody: JSON.stringify(message),
            QueueUrl: this.queueUrl
        };

        const result = await this.sqs.sendMessage(params).promise();

        console.log(`result: ${JSON.stringify(result)}`);
    }
}
