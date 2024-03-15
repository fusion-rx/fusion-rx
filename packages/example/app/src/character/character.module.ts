import { FsnModule } from '@fusion-rx/core';
import { CharacterService } from './character.service';
import { DatabaseModule } from '../database/database.module';

@FsnModule({
    imports: [DatabaseModule],
    providers: [CharacterService]
})
export class CharacterModule {}
