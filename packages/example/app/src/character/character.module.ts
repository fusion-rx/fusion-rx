import { FsnModule } from '@fusion-rx/core';
import { CharacterService } from './character.service';
import { DatabaseModule } from '../database/database.module';
import { CharacterRouteService } from './character.routes';

@FsnModule({
    imports: [DatabaseModule],
    providers: [CharacterService],
    routes: [CharacterRouteService]
})
export class CharacterModule {}
