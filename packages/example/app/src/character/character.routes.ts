import {
    Param,
    PipeNum,
    PipeStrArr,
    Query,
    Route,
    Router
} from '@fusion-rx/core';
import { CharacterService } from './character.service.js';

@Router({
    basePath: 'characters'
})
export class CharactersRoute {
    constructor(public characterService: CharacterService) {}

    @Route({
        method: 'get'
    })
    getAllCharacters(
        @Query('lastname', PipeStrArr) lastname?: string[],
        @Query('age', PipeNum) age?: number,
        @Query('decade', PipeNum) decade?: number
    ) {
        return this.characterService.getCharactersByAgeNameDecade({
            lastname,
            age,
            decade
        });
    }

    @Route({
        method: 'get',
        path: ':name'
    })
    getCharacterByName(@Param('name', false) name: string) {
        return this.characterService.getCharacterByName(name);
    }
}
