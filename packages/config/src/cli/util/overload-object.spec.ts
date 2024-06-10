import { overloadObject } from './overload-object.js';

declare type overloadTest = {
    configOpt: {
        config1: string[];
        config2?: {
            innerConfig: {
                config3: string;
            };
        };
    };
    otherConfig?: string[];
};

const base: overloadTest = {
    configOpt: {
        config1: ['opta', 'optb', 'optc'],
        config2: {
            innerConfig: {
                config3: 'original'
            }
        }
    },
    otherConfig: ['othera', 'otherb', 'otherc']
};

const overload: overloadTest = {
    configOpt: {
        config1: ['overloada', 'overloadb', 'overloadc'],
        config2: {
            innerConfig: {
                config3: 'overloaded'
            }
        }
    }
};

const overload2: overloadTest = {
    configOpt: {
        config1: ['overloada', 'overloadb', 'overloadc']
    }
};

const liveOverload = {
    protocol: 'https',
    dvrs: {
        '1001': {
            name: 'SAPN DVAS 1',
            ip: '10.140.140.99',
            groups: {
                entry: {
                    name: 'SAPN-Entry',
                    monitorID: 1
                },
                exit: {
                    name: 'SAPN-Exit',
                    monitorID: 2
                }
            }
        }
    }
};

const liveBase = {
    protocol: 'https'
};

describe('Overload object', () => {
    test('Can overload live', () => {
        console.log(
            JSON.stringify(overloadObject(liveBase, liveOverload), null, 3)
        );
        expect(true).toEqual(true);
    });

    test('Can overload object', () => {
        const overloaded = JSON.stringify(overloadObject(base, overload));
        const expected = JSON.stringify({
            configOpt: {
                config1: ['overloada', 'overloadb', 'overloadc'],
                config2: {
                    innerConfig: {
                        config3: 'overloaded'
                    }
                }
            },
            otherConfig: ['othera', 'otherb', 'otherc']
        });
        expect(overloaded).toEqual(expected);
    });

    test('Can overload object with depth sepcified', () => {
        const overloaded = JSON.stringify(overloadObject(base, overload2));
        const expected = JSON.stringify({
            configOpt: {
                config1: ['overloada', 'overloadb', 'overloadc'],
                config2: {
                    innerConfig: {
                        config3: 'original'
                    }
                }
            },
            otherConfig: ['othera', 'otherb', 'otherc']
        });
        expect(overloaded).toEqual(expected);
    });
});
