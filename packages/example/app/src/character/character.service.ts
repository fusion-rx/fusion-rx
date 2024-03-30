import { filter, take } from 'rxjs';
import { Injectable } from '@fusion-rx/core';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CharacterService {
    constructor(private _databaseService: DatabaseService) {}

    public getCharacterByName(name: string) {
        return this._databaseService.getAllCharacters().pipe(
            filter((character) => character.name === name),
            take(1)
        );
    }

    public getCharacters(query: {
        lastname?: string[];
        age?: number;
        decade?: number;
    }) {
        return this._databaseService.getAllCharacters().pipe(
            filter((character) => {
                const lastname = character.name.split(' ')[1];
                const age = character.age;
                const decade = Math.floor(character.age * 0.1);

                if (
                    query.lastname !== undefined &&
                    !query.lastname.includes(lastname)
                ) {
                    return false;
                }

                if (query.age !== undefined && query.age !== age) {
                    return false;
                }

                if (query.decade !== undefined && query.decade !== decade) {
                    return false;
                }

                return true;
            })
        );
    }
}
