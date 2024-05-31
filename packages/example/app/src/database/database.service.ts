import { Injectable } from '@fusion-rx/core';
import { t_characters } from '@fusion-rx/test';
import { of } from 'rxjs';

@Injectable()
export class DatabaseService {
    constructor() {}

    getAllCharacters() {
        return of(...t_characters);
    }

    // getCharacterByNameAgeDecade(query: {
    //     lastname?: string[];
    //     age?: number;
    //     decade?: number;
    // }) {
    //     let q = select().from(t_characters);

    //     if (query.lastname || query.age || query.decade) {
    //         if (query.lastname) {
    //             q.
    //         }

    //     }
    // }
}
