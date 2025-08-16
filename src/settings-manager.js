class SettingsManager {
    #storage = window.localStorage;

    get hardMode() {
        return this.#storage.getItem('hardMode') === 'true';
    }

    set hardMode(value) {
        this.#storage.setItem('hardMode', value);
    }

    get theme() {
        return this.#storage.getItem('theme') ?? 'auto';
    }

    set theme(value) {
        window.updateTheme(value);
        this.#storage.setItem('theme', value);
    }

    constructor() {
        // Bind to inputs in the Options dialog.
        const themeInputs = document.querySelectorAll('#optionsDialog input[name=theme]');
        const hardModeInput = document.querySelector('#optionsDialog input[name=hardMode]');

        themeInputs.forEach((input) => {
            input.checked = input.value === this.theme;
            input.addEventListener('change', () => {
                this.theme = input.value;
            });
        });

        hardModeInput.checked = this.hardMode;
        hardModeInput.addEventListener('change', () => {
            this.hardMode = hardModeInput.checked;
        });
    }
}

export const settingsManager = new SettingsManager();
