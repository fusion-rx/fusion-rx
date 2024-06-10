/**
 * Creates a new ID for this report in this session.
 * @returns An id as a number.
 *
 * @publicApi
 */
export function createJobID(userID: string): number {
    const date = new Date();
    return Number.parseInt(
        `${date.getFullYear()}` +
            `${date.getMonth()}` +
            `${date.getDate()}` +
            `${date.getHours()}` +
            `${date.getMinutes()}` +
            `${date.getSeconds()}` +
            `${date.getMilliseconds}` +
            `${userID}`,
        10
    );
}
