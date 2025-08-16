// Load custom elements
import './card-art.mjs';
import './card-select.mjs';

import {settingsManager} from './settings-manager.js';
import {Game} from './game.mjs';

// TODO: Set theme

// Start the game already!
new Game(settingsManager.hardMode);
