import { Client } from '../client';
import * as strapi from './strapi';

export function installAdapters(client: Client) {
	client.addAdapter('strapi_validations', strapi.validations);
}
