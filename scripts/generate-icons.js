const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '../public/icons');
const svgPath = path.join(iconDir, 'icon.svg');

// Ensure directory exists
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Read SVG
const svgBuffer = fs.readFileSync(svgPath);

// Generate each size
async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Also generate favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/favicon.png'));
  console.log('Generated: favicon.png');

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png');
}

generateIcons().then(() => {
  console.log('All icons generated successfully!');
}).catch(err => {
  console.error('Error generating icons:', err);
});
