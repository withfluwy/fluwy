import type { Application } from '@/lib/core/app/index.js';
import * as strapi from './strapi.js';

export function installAdapters(app: Application) {
    app.addAdapter('strapi_validations', strapi.validations);
}
