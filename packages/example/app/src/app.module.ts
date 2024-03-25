import { FsnModule } from '@fusion-rx/core';
import { ExpressModule } from '@fusion-rx/common';
import { AppRoutes } from './app.routes';
import { CharacterModule } from './character/character.module';

@FsnModule({
    imports: [
        ExpressModule.forRoot({
            port: 1335,
            host: '0.0.0.0'
        }),
        CharacterModule
    ],
    providers: [AppRoutes]
})
export class AppModule {
    constructor() {}
}
