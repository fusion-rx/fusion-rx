import { Injectable } from '@fusion-rx/core';
import { t_characters, from } from '@fusion-rx/test';

@Injectable()
export class DatabaseService {
    constructor() {}

    getAllCharacters() {
        return from(t_characters).select().end();
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
