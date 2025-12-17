const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'public', 'cursor.png');
const bitmap = fs.readFileSync(filePath);
console.log(Buffer.from(bitmap).toString('base64'));
