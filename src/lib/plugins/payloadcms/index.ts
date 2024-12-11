import type { Plugin } from '@/lib/core/contracts.js';
import { set_form_errors } from '@/lib/plugins/payloadcms/operations/set_form_errors/index.js';

export const PayloadCMS: Plugin = {
    name: 'payloadcms',

    operations: {
        set_form_errors,
    },
};
