import { test } from '@playwright/test';
import { screenshotTest } from '../../utils.js';

test('input component', screenshotTest('/components/forms/input/tests'));
test('input component dark mode', screenshotTest('/components/forms/input/tests', { darkMode: true }));