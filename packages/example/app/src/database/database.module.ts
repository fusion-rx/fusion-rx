import { FsnModule } from '@fusion-rx/core';
import { DatabaseService } from './database.service';

@FsnModule({
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule {}
