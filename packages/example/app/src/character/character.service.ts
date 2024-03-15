import { concatMap, filter, take } from 'rxjs';
import { Injectable } from '@fusion-rx/core';
import { DatabaseService } from '../database/database.service';
import { ExpressService } from '@fusion-rx/common';

@Injectable()
export class CharacterService {
    constructor(
        private _databaseService: DatabaseService,
        private _expressService: ExpressService
    ) {}

    getCharacterByName = this._expressService
        .get<{
            name: string;
        }>('/character/:name', {
            params: {
                name: 'string'
            }
        })
        .pipe(
            concatMap((value) => {
                return this._databaseService.getAllCharacters().pipe(
                    filter((character) => character.name === value.params.name),
                    take(1)
                );
            })
        );

    // public getCharacterByName(name: string) {
    //     return this._databaseService.getAllCharacters().pipe(
    //         filter((character) => character.name === name),
    //         take(1)
    //     );
    // }

    public getCharactersByLastName(lastName: string) {
        return this._databaseService.getAllCharacters().pipe(
            filter((character) => {
                const split = character.name.split(' ');
                return split[split.length - 1] === lastName;
            })
        );
    }

    public getCharactersByAge(age: number) {
        return this._databaseService
            .getAllCharacters()
            .pipe(filter((character) => character.age === age));
    }

    public getCharactersByAgeDecade(decade: number) {
        return this._databaseService
            .getAllCharacters()
            .pipe(
                filter(
                    (character) =>
                        Math.floor(character.age * 0.1) === Math.floor(decade)
                )
            );
    }
}
