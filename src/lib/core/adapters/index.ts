import { Client } from '../client/index.js';
import * as strapi from './strapi.js';

export function installAdapters(client: Client) {
    client.addAdapter('strapi_validations', strapi.validations);
}
