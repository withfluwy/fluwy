import { test } from '@playwright/test';
import { screenshotTest } from '../../utils.js';

test('buttons test', screenshotTest());
test('buttons test dark mode', screenshotTest({ darkMode: true }));
