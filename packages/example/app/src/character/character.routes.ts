import { Injectable } from '@fusion-rx/core';
import { CharacterService } from './character.service';
import { ExpressService, catchNoElementsInSequence } from '@fusion-rx/common';
import { last, scan } from 'rxjs';
import { SeinfeldCharacter } from '../database/character-db';

@Injectable()
export class CharacterRouteService {
    constructor(
        private _expressService: ExpressService,
        private _characterService: CharacterService
    ) {}

    getCharacterByName = this._expressService
        .get<{
            name: string;
        }>('/character/:name', {
            params: {
                name: 'string'
            }
        })
        .subscribe((next) => {
            this._characterService
                .getCharacterByName(next.params.name)
                .subscribe({
                    next: (character) => {
                        next.res.status(200).send(character);
                    },
                    error: (err) => {
                        next.res.status(err['status'] ?? 500).send(err);
                    }
                });
        });

    getCharacter = this._expressService
        .get<{
            lastname?: string[];
            age?: number;
            decade?: number;
        }>('/character', {
            query: {
                lastname: 'array',
                age: 'number',
                decade: 'number'
            }
        })
        .subscribe((next) => {
            this._characterService
                .getCharacters(next.query)
                .pipe(
                    scan((characters, character) => {
                        characters.push(character);
                        return characters;
                    }, [] as SeinfeldCharacter[]),
                    last(),
                    catchNoElementsInSequence
                )
                .subscribe({
                    next: (characters) => {
                        next.res.status(200).send(characters);
                    },
                    error: (err) => {
                        next.res.status(err['status'] ?? 500).send(err);
                    }
                });
        });
}
