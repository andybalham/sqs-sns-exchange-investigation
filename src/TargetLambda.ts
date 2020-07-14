import { SNS } from 'aws-sdk';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { PublishInput } from 'aws-sdk/clients/sns';

class FlowCallContext {
    correlationId: string;
}

abstract class FlowMessage {
    callContext: FlowCallContext;
}

class FlowRequestContext {
    functionName: string;
    requestId: string;
}

class FlowRequestMessage extends FlowMessage {
    requestContext: FlowRequestContext;
    request: any;
}

class FlowResponseContext {
    requestId: string;
}

class FlowResponseMessage extends FlowMessage {
    responseContext: FlowResponseContext;
    response: any;
}

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

        const handleRecord = async (record: SQSRecord): Promise<void> => {

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

            const publishResponse = await this.snsClient.publish(params).promise();

            console.log(`publishResponse: ${JSON.stringify(publishResponse)}`);
        };

        sqsEvent.Records.forEach(record => {
            handleRecord(record)
                .catch(err => console.error(err.message));
        });

        return null;
    }
}
