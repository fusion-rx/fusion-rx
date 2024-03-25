import { of } from 'rxjs';
import { Injectable } from '@fusion-rx/core';
import { SeinfeldCharacters } from './character-db';

@Injectable()
export class DatabaseService {
    constructor() {}

    getAllCharacters() {
        return of(...SeinfeldCharacters);
    }
}
