import { Client } from '../client/index.js';

import { alert } from './alert.js';
import { close_dialog } from './close_dialog.js';
import { context } from './context.js';
import { deleteOperation } from './delete.js';
import { emit } from './emit.js';
import { extract } from './extract/index.js';
import { get } from './get.js';
import { goto } from './goto.js';
import { if_operation } from './if_operation.js';
import { notify } from './notify.js';
import { open_dialog } from './open_dialog.js';
import { refresh } from './refresh.js';
import { set_auth_token } from './set_auth_token.js';
import { set_auth_user } from './set_auth_user.js';
import { set_mode } from './set_mode/index.js';
import { submit } from './submit.js';
import { transform } from './transform/index.js';
import { unset_local_storage } from './unset_local_storage.js';
import { wrap_into } from './wrap_into/index.js';
import * as cookies from './cookies.js';

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
    client.addOperation('set_mode', set_mode);
    client.addOperation('alert', alert);
}
