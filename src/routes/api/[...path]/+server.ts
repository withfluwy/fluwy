import { createProxyApiHandlers } from '@/lib/integrations/sveltekit.js';

export const { GET } = createProxyApiHandlers('http://localhost:3000/api/');
