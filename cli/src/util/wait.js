// @ts-check

export const wait = (timeout = 2000) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve('proceed');
        }, timeout);
    });
