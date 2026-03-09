// Saved Settings
let settings = {
    gender: 'none',
    dateFormat: 'YYYY-MM-DD'
};

// Load Settings from local storage
function loadSettingsFromStorage() {
    try {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
    } catch (e) {
        console.log("Fehler beim Laden der Einstellungen aus dem LocalStorage:\n" + e)
    }
}

function toggleDialog() {
    const dialog = document.getElementById("settingsDialog");
    
    if (dialog.open) {
        saveSettings();
        dialog.close();
    } else {
        dialog.showModal();
    }
}

function saveSettings() {
    try {
        settings.gender = document.getElementById('gender').value;
        settings.dateFormat = document.getElementById('dateFormat').value;
        
        // Save settings in local storage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        console.log('Einstellungen im localStorage gespeichert:', settings);

        const status = document.getElementById('settingsStatus');
        if (status) {
            status.textContent = 'Einstellungen gespeichert.';
            setTimeout(() => {
                status.textContent = '';
            }, 1500);
        }
    } catch (e) {
        console.log("Fehler beim Speichern der Einstellungen im LocalStorage:\n" + e)
    }
}

function loadSettings() {
    document.getElementById('gender').value = settings.gender;
    document.getElementById('dateFormat').value = settings.dateFormat;
}

// Loads Settings into Dialog
document.addEventListener('DOMContentLoaded', () => {
    loadSettingsFromStorage();
    loadSettings();
    
    document.getElementById('gender').addEventListener('change', saveSettings);
    document.getElementById('dateFormat').addEventListener('change', saveSettings);
});