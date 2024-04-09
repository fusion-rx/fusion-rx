/**
 * A dummy decorator used for testing that forces TypeScript
 * to define the `design:paramtypes` metadata required
 * for many dependency injection operations.
 */
export const DummyDecorator =
    () =>
    // @ts-ignore
    (reference: Class<any>) => {};
