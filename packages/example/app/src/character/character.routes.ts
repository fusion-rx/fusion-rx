import { Injectable } from '@fusion-rx/core';
import { CharacterService } from './character.service.js';
import { Router } from '@fusion-rx/core';

@Injectable()
export class CharacterRouteService {
    constructor(
        public characterService: CharacterService,
        private _router: Router
    ) {
        this._getAllCharacters();
        this._getCharacterByName();
    }

    private _getAllCharacters() {
        this._router
            .get('')
            .provide({
                queryParams: {
                    lastname: 'string[]',
                    age: '_number',
                    decade: '_number'
                }
            })
            .register<{
                queryParams: {
                    lastname: string[];
                    age?: number;
                    decade?: number;
                };
            }>((providers) =>
                this.characterService.getCharacters(providers.queryParams)
            );
    }

    private _getCharacterByName() {
        this._router
            .get(':name')
            .provide({
                urlParams: {
                    name: 'string'
                }
            })
            .register<{
                urlParams: {
                    name: string;
                };
            }>((providers) => {
                return this.characterService.getCharacterByName(
                    providers.urlParams.name
                );
            });
    }
}
