export class TargetLambda {
    async handle(event: any): Promise<any> {
        console.log(`event: ${JSON.stringify(event)}`);
        return event;
    }
}
