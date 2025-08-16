// Load custom elements
import './card-art.mjs';
import './card-select.mjs';

import { settingsManager } from './settings-manager.js';
import { Game } from './game.mjs';

// Update theme when preferred color scheme changes.
window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
        window.updateTheme(settingsManager.theme);
    });

// Start the game already!
new Game(settingsManager.hardMode);
