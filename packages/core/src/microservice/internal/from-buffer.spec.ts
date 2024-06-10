import { fromBuffer } from './from-buffer.js';

describe('From Buffer', () => {
    test('Can decode buffered message', () => {
        const buffer = Buffer.from(
            JSON.stringify({
                message: 'the quick brown fox jumped over the lazy dog.'
            })
        );

        const decoded = fromBuffer(buffer);
        expect(decoded).toEqual({
            message: 'the quick brown fox jumped over the lazy dog.'
        });
    });

    test('Can handle errors gracefully', () => {
        const decoded = fromBuffer();
        expect(decoded).toEqual(undefined);
    });
});
