import { FsnModule } from '@fusion-rx/core';
import { CharacterModule } from './character/character.module.js';
import { AppRoutes } from './app.routes.js';

@FsnModule({
    imports: [CharacterModule],
    routes: [AppRoutes]
})
export class AppModule {
    constructor() {}
}
