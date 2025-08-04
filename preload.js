const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Listen for data from main process
    onDataLoaded: (callback) => {
        ipcRenderer.on('data-loaded', callback);
    },
    onDataError: (callback) => {
        ipcRenderer.on('data-error', callback);
    },

    // Request data refresh
    refreshData: () => ipcRenderer.invoke('refresh-data'),

    // Fungsi untuk membuka WhatsApp
    openWhatsApp: (phoneNumber) => ipcRenderer.invoke('open-whatsapp', phoneNumber),

    // Fungsi untuk update status
    updateService: (updateInfo) => ipcRenderer.invoke('update-service', updateInfo),

    // New function for updating contact status
    updateContactStatus: (updateInfo) => ipcRenderer.invoke('update-contact-status', updateInfo),

    // New function for adding customer
    addCustomer: (customerData) => ipcRenderer.invoke('add-customer', customerData),

    // Remove listeners
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});

// Also expose a simple test to verify the API is loaded
contextBridge.exposeInMainWorld('electronTest', {
    ping: () => 'pong'
});

console.log('Preload script loaded successfully');