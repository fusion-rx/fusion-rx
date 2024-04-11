import { FsnModule } from '@fusion-rx/core';
import { AppRoutes } from './app.routes';
import { CharacterModule } from './character/character.module';
import { ExpressModule } from '@fusion-rx/common';

@FsnModule({
    imports: [
        ExpressModule.forRoot({
            port: 1335,
            host: '0.0.0.0'
        }),
        CharacterModule
    ],
    routes: [AppRoutes]
})
export class AppModule {
    constructor() {}
}
