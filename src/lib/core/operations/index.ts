import { Client } from '../client';

import { close_dialog } from './close_dialog';
import { context } from './context';
import { deleteOperation } from './delete';
import { emit } from './emit';
import { extract } from './extract';
import { get } from './get';
import { goto } from './goto';
import { if_operation } from './if_operation';
import { notify } from './notify';
import { open_dialog } from './open_dialog';
import { refresh } from './refresh';
import { set_auth_token } from './set_auth_token';
import { set_auth_user } from './set_auth_user';
import * as cookies from './cookies';
import { submit } from './submit';
import { transform } from './transform';
import { unset_local_storage } from './unset_local_storage';
import { wrap_into } from './wrap_into';

export function installOperations(client: Client) {
	client.addOperation('close_dialog', close_dialog);
	client.addOperation('context', context);
	client.addOperation('delete', deleteOperation);
	client.addOperation('emit', emit);
	client.addOperation('extract', extract);
	client.addOperation('get', get);
	client.addOperation('goto', goto);
	client.addOperation('if', if_operation);
	client.addOperation('log', console.log);
	client.addOperation('notify', notify);
	client.addOperation('open_dialog', open_dialog);
	client.addOperation('refresh', refresh);
	client.addOperation('remove_cookie', cookies.unset_operation);
	client.addOperation('remove_local_storage', unset_local_storage);
	client.addOperation('set_auth_token', set_auth_token);
	client.addOperation('set_auth_user', set_auth_user);
	client.addOperation('set_cookie', cookies.set_operation);
	client.addOperation('submit', submit);
	client.addOperation('transform', transform);
	client.addOperation('unset_cookie', cookies.unset_operation);
	client.addOperation('unset_local_storage', unset_local_storage);
	client.addOperation('wrap_into', wrap_into);
}
