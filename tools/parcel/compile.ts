import { CompilerOptions } from './types';
import { Parcel } from '@parcel/core';
import { BuildSuccessEvent, BuildFailureEvent } from '@parcel/types';
import { Observable } from 'rxjs';

export const makeBundler = (options: CompilerOptions) => new Parcel(options);

export const compile = (options: CompilerOptions) => {
    return new Observable<BuildSuccessEvent>((subscriber) => {
        makeBundler(options)
            .run()
            .then((next) => {
                subscriber.next(next);
                subscriber.complete();
            })
            .catch((reason) => subscriber.error(reason));
    });
};

export const watch = (options: CompilerOptions) => {
    return new Observable<BuildSuccessEvent | BuildFailureEvent>(
        (subscriber) => {
            const bundler = makeBundler(options);
            bundler.watch((err, event) => {
                if (err) throw err;
                if (event) subscriber.next(event);
            });
        }
    );
};
