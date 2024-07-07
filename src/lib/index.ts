import * as component from './components/index.js';
import * as primitives from './components/primitives/index.js';
import { createApp } from './core/app/index.js';
import { str } from './core/utils/index.js';

const app = createApp();

// Register primitive components
for (const [key, value] of Object.entries(primitives)) {
	app.registerComponent(str(key).kebabCase(), value);
}

for (const [key, value] of Object.entries(component)) {
	if (key in primitives) throw new Error(`Component [${key}] already registered as primitive`);

	app.registerComponent(str(key).kebabCase(), value);
}

export { app };
