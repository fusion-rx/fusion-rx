import { FsnModule } from '@fusion-rx/core';
import { CharacterModule } from './character/character.module.js';
import { RouterModule } from '@fusion-rx/core';

@FsnModule({
    imports: [
        CharacterModule,
        RouterModule.forRoot({
            basePath: 'app'
        })
    ]
})
export class AppModule {
    constructor() {}
}
