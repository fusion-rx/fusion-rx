import { FsnModule } from '@fusion-rx/core';
import { CharacterService } from './character.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { CharactersRoute } from './character.routes.js';

@FsnModule({
    imports: [DatabaseModule],
    providers: [CharacterService],
    routes: [CharactersRoute]
})
export class CharacterModule {}
