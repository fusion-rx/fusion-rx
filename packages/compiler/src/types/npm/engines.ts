import { SemverRange } from 'compiler/alias';

export type Engines = {
    readonly browsers?: string | Array<string>;
    readonly electron?: SemverRange;
    readonly node?: SemverRange;
    readonly parcel?: SemverRange;
};
