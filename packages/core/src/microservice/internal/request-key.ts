function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function requestKey(eventName: string) {
    const now = new Date();
    return (
        eventName +
        '_' +
        [
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds(),
            randomIntFromInterval(1, now.getMilliseconds() + 1)
        ].join('.')
    );
}
