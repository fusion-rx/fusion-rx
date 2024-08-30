export const timer = () => {
    const toMS = (d: Date) => {
        const minutes = d.getHours() * 60 + d.getMinutes();
        const seconds = minutes * 60 + d.getSeconds();
        return seconds * 1000 + d.getMilliseconds();
    };

    const start = new Date();
    return {
        end: () => toMS(new Date()) - toMS(start)
    };
};
