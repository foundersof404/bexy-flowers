const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'public', 'cursor.png');
const htmlPath = path.join(__dirname, 'index.html');

try {
    const bitmap = fs.readFileSync(imagePath);
    const base64 = Buffer.from(bitmap).toString('base64');
    const dataUri = `url('data:image/png;base64,${base64}') 16 16, auto`;

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Replace the cursor URL in the style tag
    const regex = /cursor:\s*url\(['"].*?['"]\),\s*(auto|pointer)\s*!important/g;
    
    const newHtml = htmlContent.replace(regex, `cursor: ${dataUri} !important`);

    fs.writeFileSync(htmlPath, newHtml);
    console.log("Successfully updated index.html with Base64 cursor.");

} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}






