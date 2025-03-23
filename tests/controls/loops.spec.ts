import { test } from '@playwright/test';
import { screenshotTest } from '../utils.js';

test('loops test', screenshotTest('/controls/loops/tests', { viewport: { width: 1920, height: 1080 } }));
