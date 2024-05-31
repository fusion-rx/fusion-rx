import '@fusion-rx/core/console/console.js';

import { bootstrap } from '@fusion-rx/core';
import { AppModule } from './src/app.module.js';

bootstrap(AppModule, {
    basePath: 'api'
});
