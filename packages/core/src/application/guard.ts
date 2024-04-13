import { Observable } from 'rxjs';
import { Req, Res } from '../interface/express';

export declare interface Guard {
    canActivate(
        req: Req,
        res: Res
    ): boolean | Observable<boolean> | Promise<boolean>;
}
