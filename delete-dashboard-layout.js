// This script will be run as part of the build process to remove the problematic file
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DashboardLayout.tsx');

try {
  if (fs.existsSync(filePath)) {
    console.log(`Deleting problematic file: ${filePath}`);
    fs.unlinkSync(filePath);
    console.log('File deleted successfully');
  } else {
    console.log('File does not exist, no need to delete');
  }
} catch (err) {
  console.error('Error deleting file:', err);
} 