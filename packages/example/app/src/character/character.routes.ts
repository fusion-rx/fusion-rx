import { Route } from '@fusion-rx/core';
import { CharacterService } from './character.service';
import { ExpressService } from '@fusion-rx/common';
import { handleNoElementsInSequence } from '@fusion-rx/shared';
import { catchError, last, scan } from 'rxjs';
import { SeinfeldCharacter } from '../database/character-db';

@Route({
    baseUrl: 'character',
    templateUrl: './character.routes.json'
})
export class CharacterRouteService {
    constructor(
        private _expressService: ExpressService,
        public characterService: CharacterService
    ) {}

    getCharacterByName = this._expressService.get<{
        name: string;
    }>(
        '/character/:name',
        {
            params: {
                name: 'string'
            }
        },
        (next) => this.characterService.getCharacterByName(next.params.name)
    );

    getCharacter = this._expressService.get<{
        lastname?: string[];
        age?: number;
        decade?: number;
    }>(
        '/character',
        {
            query: {
                lastname: 'array',
                age: 'number',
                decade: 'number'
            }
        },
        (next) =>
            this.characterService.getCharacters(next.query).pipe(
                scan((characters, character) => {
                    characters.push(character);
                    return characters;
                }, [] as SeinfeldCharacter[]),
                last(),
                catchError((err) => handleNoElementsInSequence(err))
            )
    );
}
