import { FsnModule } from '@fusion-rx/core';
import { CharacterService } from './character.service.js';
import { DatabaseModule } from '../database/database.module.js';
import { RouterModule } from '@fusion-rx/core';
import { CharacterRouteService } from './character.routes.js';

@FsnModule({
    imports: [
        DatabaseModule,
        RouterModule.forRoot({
            basePath: 'character'
        })
    ],
    providers: [CharacterService, CharacterRouteService]
})
export class CharacterModule {}
