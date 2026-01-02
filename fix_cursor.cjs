const fs = require('fs');

// Read the CSS file to get the base64 cursor
const css = fs.readFileSync('src/index.css', 'utf8');
const match = css.match(/cursor:\s*url\(['"](data:image\/png;base64,[^'"]+)['"]\)\s*16\s*16,\s*(auto|pointer)\s*!important/);

if (!match) {
    console.error('Could not find base64 cursor in CSS');
    process.exit(1);
}

const base64Cursor = match[1];
const cursorType = match[2];

console.log('Found base64 cursor in CSS, length:', base64Cursor.length);

// Read HTML file
let html = fs.readFileSync('index.html', 'utf8');

// Replace the external URL with the base64 cursor
const newHtml = html.replace(
    /cursor:\s*url\(['"]http:\/\/www\.rw-designer\.com\/cursor-extern\.php\?id=\d+['"]\),\s*(auto|pointer)\s*!important/g,
    `cursor: url('${base64Cursor}') 16 16, $1 !important`
);

fs.writeFileSync('index.html', newHtml);
console.log('Successfully updated index.html with base64 cursor from CSS');









