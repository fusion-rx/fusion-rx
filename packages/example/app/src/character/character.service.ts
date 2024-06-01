import { Injectable } from '@fusion-rx/core';
import { DatabaseService } from '../database/database.service.js';
import { from, t_characters } from '@fusion-rx/test';
import { filter } from 'rxjs';

@Injectable()
export class CharacterService {
    constructor(private _databaseService: DatabaseService) {}

    public getCharacterByName(name: string) {
        return from(t_characters)
            .select()
            .where('pk_name')
            .like(new RegExp(name))
            .end();
    }

    getCharactersByAgeNameDecade(query: {
        lastname?: string[];
        age?: number;
        decade?: number;
    }) {
        return this._databaseService.getAllCharacters().pipe(
            filter((character) => {
                const lastname = query.lastname
                    ? query.lastname.some(
                          (nm) =>
                              nm?.toLowerCase() ===
                              character.pk_name.split(' ').pop()?.toLowerCase()
                      )
                    : true;
                const age = query.age ? query.age === character.age : true;
                const decade = query.decade
                    ? query.decade === Math.floor(character.age * 0.1)
                    : true;

                return lastname && age && decade;
            })
        );
    }
}
