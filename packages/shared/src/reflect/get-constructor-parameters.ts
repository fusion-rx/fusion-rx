import 'reflect-metadata';

export const getConstructorParameters = (target: any) => {
    const toReturn: { [name: string | symbol]: any } = {};

    if (target) {
        Reflect.ownKeys(target).forEach((parameters) => {
            toReturn[parameters] = typeof target[parameters];
        });
    }

    return toReturn;
};
