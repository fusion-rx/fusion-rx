import { Injectable } from '@fusion-rx/core';
import { t_characters } from '@fusion-rx/test';
import { of } from 'rxjs';

@Injectable()
export class DatabaseService {
    constructor() {}

    getAllCharacters() {
        return of(...t_characters);
    }
}
