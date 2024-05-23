import { FsnModule } from '@fusion-rx/core';
import { DatabaseService } from './database.service.js';

@FsnModule({
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule {}
