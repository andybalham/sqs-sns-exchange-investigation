import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { PublishInput } from 'aws-sdk/clients/sns';
import { FlowRequestMessage, FlowResponseMessage } from './FlowMessage';

export class TargetLambda {

    readonly snsClient: SNS;
    readonly responseTopicArn: string;

    constructor(snsClient: SNS, responseTopicArn: string) {
        this.snsClient = snsClient;
        this.responseTopicArn = responseTopicArn;
    }

    async handle(sqsEvent: SQSEvent): Promise<any> {

        // const request: FlowRequestMessage = {
        //     callContext: {
        //         correlationId: 'COR:8928EU2983JD923'
        //     },
        //     requestContext: {
        //         functionName: 'TestFunction',
        //         requestId: 'REQ:92838JF982J3R9'
        //     },
        //     request: {
        //         any: 'old',
        //         rubbish: true
        //     }
        // };
        // console.log(JSON.stringify({request: JSON.stringify(request)}));

        console.log(`recordCount: ${sqsEvent.Records.length}`);

        for (let index = 0; index < sqsEvent.Records.length; index++) {

            const record = sqsEvent.Records[index];
            const requestMessage: FlowRequestMessage = JSON.parse(record.body);

            const responseMessage: FlowResponseMessage = {
                callContext: requestMessage.callContext,
                responseContext: {
                    requestId: requestMessage.requestContext.requestId
                },
                response: requestMessage.request
            };
    
            const params: PublishInput = {
                Message: JSON.stringify(responseMessage),
                TopicArn: this.responseTopicArn,
                MessageAttributes: {
                    FunctionName: { DataType: 'String', StringValue: requestMessage.requestContext.functionName }
                }
            };
    
            console.log(`params: ${JSON.stringify(params)}`);
    
            const publishResponse = await this.snsClient.publish(params).promise();
    
            console.log(`publishResponse: ${JSON.stringify(publishResponse)}`);                
        }

        return null;
    }
}
