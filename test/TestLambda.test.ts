import { handleTest, handleTarget } from '../src/lambda';
import { expect } from 'chai';

describe('Test lambdas', () => {

    it('handles test invoke', async () => {

        const event = 'Hello Lambda!';

        const result = await handleTest(event);

        expect(result).to.equal(event);
    });
});