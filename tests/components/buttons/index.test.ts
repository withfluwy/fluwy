import { test } from '@playwright/test';
import { screenshotTest } from '../../utils.js';

test('buttons test', screenshotTest('/components/buttons/tests'));
test('buttons test dark mode', screenshotTest('/components/buttons/tests', { darkMode: true }));
