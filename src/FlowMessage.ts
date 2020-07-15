export class FlowCallContext {
    correlationId: string;
}

export abstract class FlowMessage {
    callContext: FlowCallContext;
}

export class FlowRequestContext {
    functionName: string;
    requestId: string;
}

export class FlowRequestMessage extends FlowMessage {
    requestContext: FlowRequestContext;
    request: any;
}

export class FlowResponseContext {
    requestId: string;
}

export class FlowResponseMessage extends FlowMessage {
    responseContext: FlowResponseContext;
    response: any;
}