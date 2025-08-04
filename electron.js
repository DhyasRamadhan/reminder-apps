import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import creds from './credentials.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

// IMPORTANT: Replace this with your complete Google Sheet ID
// You can find this in your Google Sheet URL: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
const SPREADSHEET_ID = '1kCidRxv1iUd3XCVPod3M8J-ItUWddEgNgZAZeVubcoM';

// Alternative: Try with a test function first
async function testGoogleSheetsConnection() {
    try {
        console.log('Testing Google Sheets connection...');
        console.log('Using Spreadsheet ID:', SPREADSHEET_ID);

        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

        // Test basic connection
        await doc.loadInfo();
        console.log('✓ Successfully connected to:', doc.title);
        console.log('✓ Sheet count:', doc.sheetCount);
        console.log('✓ Sheet titles:', doc.sheetsByIndex.map(sheet => sheet.title));

        return true;
    } catch (error) {
        console.error('✗ Connection test failed:', error.message);
        return false;
    }
}

// Helper function to get the last service date from services object
function getLastServiceDate(services) {
    if (!services) return '';

    let lastDate = null;

    Object.values(services).forEach(dateStr => {
        if (dateStr && dateStr.trim() !== '') {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime()) && (!lastDate || date > lastDate)) {
                lastDate = date;
            }
        }
    });

    return lastDate ? lastDate.toISOString().split('T')[0] : '';
}

// Helper function to calculate next service date (assuming 6 months interval)
function getNextServiceDate(services) {
    const lastService = getLastServiceDate(services);
    if (!lastService) return '';

    const lastDate = new Date(lastService);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 6); // Add 6 months for next service

    return nextDate.toISOString().split('T')[0];
}

async function getDataFromSheet() {
    try {
        // First test the connection
        const connectionTest = await testGoogleSheetsConnection();
        if (!connectionTest) {
            throw new Error('Failed to connect to Google Sheets. Please check your spreadsheet ID and permissions.');
        }

        // Create JWT auth client with full permissions for read/write
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        // Initialize the sheet with proper auth
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

        await doc.loadInfo();
        console.log('Sheet loaded:', doc.title);

        const sheet = doc.sheetsByIndex[0];
        if (!sheet) {
            throw new Error('No sheet found at index 0');
        }

        console.log('Working with sheet:', sheet.title);
        console.log('Sheet has', sheet.rowCount, 'rows and', sheet.columnCount, 'columns');

        // IMPORTANT: Load header values first
        await sheet.loadHeaderRow();
        console.log('Header row loaded');
        console.log('Headers found:', sheet.headerValues);

        // Verify expected headers exist
        const expectedHeaders = ['Nama', 'NO SERI TANGKI', 'NO SERI KOLEKTOR', 'Alamat', 'No. Telp'];
        const missingHeaders = expectedHeaders.filter(header => !sheet.headerValues.includes(header));

        if (missingHeaders.length > 0) {
            console.warn('Warning: Missing expected headers:', missingHeaders);
            console.log('Available headers:', sheet.headerValues);
        }

        const rows = await sheet.getRows();
        console.log('Rows loaded:', rows.length);

        if (rows.length === 0) {
            console.log('No data rows found in the sheet');
            return [];
        }

        const data = rows.map((row, index) => {
            try {
                const customerData = {
                    name: row.get('Nama') || '',
                    serialTangki: row.get('NO SERI TANGKI') || '',
                    serialKolektor: row.get('NO SERI KOLEKTOR') || '',
                    address: row.get('Alamat') || '',
                    phone: row.get('No. Telp') || '',
                    services: {
                        servis1: row.get('SERVIS 1') || '',
                        servis2: row.get('SERVIS 2') || '',
                        servis3: row.get('SERVIS 3') || '',
                        servis4: row.get('SERVIS 4') || '',
                        servis5: row.get('SERVIS 5') || '',
                        servis6: row.get('SERVIS 6') || '',
                        servis7: row.get('SERVIS 7') || '',
                        servis8: row.get('SERVIS 8') || '',
                        servis9: row.get('SERVIS 9') || '',
                        servis10: row.get('SERVIS 10') || '',
                        servis11: row.get('SERVIS 11') || '',
                        servis12: row.get('SERVIS 12') || '',
                        servis13: row.get('SERVIS 13') || '',
                        servis14: row.get('SERVIS 14') || '',
                        servis15: row.get('SERVIS 15') || ''
                    }
                };

                // Calculate last service and next service dates
                customerData.lastService = getLastServiceDate(customerData.services);
                customerData.nextService = getNextServiceDate(customerData.services);

                return customerData;
            } catch (rowError) {
                console.error(`Error processing row ${index}:`, rowError);
                return null;
            }
        }).filter(customer => customer !== null && customer.name !== ''); // Filter out null entries and empty names

        console.log('Processed data:', data.length, 'valid records');
        return data;
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);

        // Provide more specific error messages
        if (error.message.includes('This operation is not supported')) {
            console.error('Possible causes:');
            console.error('1. Invalid or incomplete spreadsheet ID');
            console.error('2. Document is not a Google Sheets file');
            console.error('3. Service account lacks proper permissions');
        }

        return []; // Kembalikan array kosong jika terjadi error
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true
        },
    });

    // Debug: Log the preload path
    console.log('Preload path:', path.join(__dirname, 'preload.js'));

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    }

    // Wait for the window to be ready before sending data
    mainWindow.webContents.once('did-finish-load', async () => {
        try {
            console.log('Window finished loading, fetching data...');
            const data = await getDataFromSheet();
            console.log('Data loaded successfully:', data.length, 'records');

            // Add a small delay to ensure the renderer is ready
            setTimeout(() => {
                mainWindow.webContents.send('data-loaded', data);
            }, 100);
        } catch (error) {
            console.error('Failed to load data:', error);
            setTimeout(() => {
                mainWindow.webContents.send('data-error', error.message);
            }, 100);
        }
    });

    // Debug: Check if preload script executed
    mainWindow.webContents.once('dom-ready', () => {
        console.log('DOM is ready');
    });
}

// Handle IPC requests for data refresh
ipcMain.handle('refresh-data', async () => {
    try {
        const data = await getDataFromSheet();
        return { success: true, data };
    } catch (error) {
        console.error('Error refreshing data:', error);
        return { success: false, error: error.message };
    }
});

// Handle WhatsApp opening
ipcMain.handle('open-whatsapp', async (event, phoneNumber) => {
    try {
        // Clean phone number (remove non-digits)
        const cleanNumber = phoneNumber.replace(/\D/g, '');

        // Add country code if not present (assuming Indonesia +62)
        let fullNumber = cleanNumber;
        if (!cleanNumber.startsWith('62') && cleanNumber.startsWith('0')) {
            fullNumber = '62' + cleanNumber.substring(1);
        } else if (!cleanNumber.startsWith('62')) {
            fullNumber = '62' + cleanNumber;
        }

        const whatsappUrl = `https://wa.me/${fullNumber}`;
        await shell.openExternal(whatsappUrl);

        return { success: true };
    } catch (error) {
        console.error('Error opening WhatsApp:', error);
        return { success: false, error: error.message };
    }
});

// Handle service updates
ipcMain.handle('update-service', async (event, updateInfo) => {
    try {
        // Create JWT auth client with write permissions
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        // Find the row to update based on customer name or serial number
        const rowToUpdate = rows.find(row =>
            row.get('Nama') === updateInfo.customerName ||
            row.get('NO SERI TANGKI') === updateInfo.serialTangki
        );

        if (!rowToUpdate) {
            throw new Error('Customer not found');
        }

        // Update the service date in the next available service column
        const serviceColumns = [
            'SERVIS 1', 'SERVIS 2', 'SERVIS 3', 'SERVIS 4', 'SERVIS 5',
            'SERVIS 6', 'SERVIS 7', 'SERVIS 8', 'SERVIS 9', 'SERVIS 10',
            'SERVIS 11', 'SERVIS 12', 'SERVIS 13', 'SERVIS 14', 'SERVIS 15'
        ];

        // Find the next empty service column
        let updatedColumn = null;
        for (const column of serviceColumns) {
            if (!rowToUpdate.get(column) || rowToUpdate.get(column).trim() === '') {
                rowToUpdate.set(column, updateInfo.serviceDate);
                updatedColumn = column;
                break;
            }
        }

        if (!updatedColumn) {
            throw new Error('All service columns are full');
        }

        await rowToUpdate.save();
        console.log(`Updated ${updatedColumn} for customer ${updateInfo.customerName}`);

        return { success: true, updatedColumn };
    } catch (error) {
        console.error('Error updating service:', error);
        return { success: false, error: error.message };
    }
});

// Handle contact status updates (if you have a status column)
ipcMain.handle('update-contact-status', async (event, updateInfo) => {
    try {
        // Create JWT auth client with write permissions
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow();
        const rows = await sheet.getRows();

        // Find the row to update
        const rowToUpdate = rows.find(row =>
            row.get('Nama') === updateInfo.customerName ||
            row.get('NO SERI TANGKI') === updateInfo.serialTangki
        );

        if (!rowToUpdate) {
            throw new Error('Customer not found');
        }

        // Update contact status (you might need to add a "Status" column to your sheet)
        if (sheet.headerValues.includes('Status')) {
            rowToUpdate.set('Status', updateInfo.status);
            await rowToUpdate.save();
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating contact status:', error);
        return { success: false, error: error.message };
    }
});

// Handle adding new customers
ipcMain.handle('add-customer', async (event, customerData) => {
    try {
        // Create JWT auth client with write permissions
        const serviceAccountAuth = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow();

        // Prepare row data
        const newRowData = {
            'Nama': customerData.name || '',
            'NO SERI TANGKI': customerData.serialTangki || '',
            'NO SERI KOLEKTOR': customerData.serialKolektor || '',
            'Alamat': customerData.address || '',
            'No. Telp': customerData.phone || ''
        };

        // Add service data if provided
        if (customerData.services) {
            const serviceColumns = [
                'SERVIS 1', 'SERVIS 2', 'SERVIS 3', 'SERVIS 4', 'SERVIS 5',
                'SERVIS 6', 'SERVIS 7', 'SERVIS 8', 'SERVIS 9', 'SERVIS 10',
                'SERVIS 11', 'SERVIS 12', 'SERVIS 13', 'SERVIS 14', 'SERVIS 15'
            ];

            serviceColumns.forEach((column, index) => {
                const serviceKey = `servis${index + 1}`;
                if (customerData.services[serviceKey]) {
                    newRowData[column] = customerData.services[serviceKey];
                }
            });
        }

        // Add the new row
        const newRow = await sheet.addRow(newRowData);
        console.log('Added new customer:', customerData.name);

        return { success: true, rowIndex: newRow.rowIndex };
    } catch (error) {
        console.error('Error adding customer:', error);
        return { success: false, error: error.message };
    }
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});