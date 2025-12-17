const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'public', 'cursor.png');
const cssPath = path.join(__dirname, 'src', 'index.css');

try {
    const bitmap = fs.readFileSync(imagePath);
    const base64 = Buffer.from(bitmap).toString('base64');
    const dataUri = `url('data:image/png;base64,${base64}') 16 16, auto`;

    let cssContent = fs.readFileSync(cssPath, 'utf8');

    // Regex to find the existing cursor definition
    // We look for "cursor: url(...) ... !important;"
    // We'll replace the whole value.

    const regex = /cursor:\s*url\(['"].*?['"]\)\s*16\s*16,\s*(auto|pointer)\s*!important/g;

    // Check if we find matches
    if (!regex.test(cssContent)) {
        console.error("Could not find cursor pattern in CSS to replace.");
        process.exit(1);
    }

    const newCss = cssContent.replace(regex, `cursor: ${dataUri} !important`);

    fs.writeFileSync(cssPath, newCss);
    console.log("Successfully updated index.css with Base64 cursor.");

} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}
