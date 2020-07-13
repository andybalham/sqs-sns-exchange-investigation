import { SNS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { PublishInput } from 'aws-sdk/clients/sns';

class FlowMessageHeader {
    sourceFunctionName: string;
    messageId: string;
}

class FlowMessage {
    header: FlowMessageHeader;
    body: any;
}

export class TargetLambda {

    readonly snsClient: SNS;
    readonly responseTopicArn: string;

    constructor(snsClient: SNS, responseTopicArn: string) {
        this.snsClient = snsClient;
        this.responseTopicArn = responseTopicArn;
    }

    async handle(sqsEvent: SQSEvent): Promise<any> {

        console.log(`recordLength: ${sqsEvent.Records.length}`);

        sqsEvent.Records.forEach(async (record) => {

            const message: FlowMessage = JSON.parse(record.body);

            const params: PublishInput = {
                Message: JSON.stringify(message),
                TopicArn: this.responseTopicArn,
                MessageAttributes: {
                    FunctionName: { DataType: 'String', StringValue: message.header.sourceFunctionName }
                }
            };
    
            try {

                const publishResponse = await this.snsClient.publish(params).promise();

                console.log(`publishResponse: ${JSON.stringify(publishResponse)}`);
                
            } catch (error) {
                console.error(JSON.stringify(error));
            }
        });

        return null;
    }
}
