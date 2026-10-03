import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function makeCircularFavicons() {
  const size = 512;
  const radius = size / 2;

  // Circular mask SVG with smooth anti-aliasing
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - 2}" fill="white" />
    </svg>`
  );

  // Optional subtle gold border ring to make the circle pop against any browser theme
  const goldBorderRing = Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - 4}" fill="none" stroke="#C9A227" stroke-width="8" />
    </svg>`
  );

  // Cut circle with transparent corners
  const circular512 = await sharp(path.join(__dirname, '../public/logo.png'))
    .resize(size, size, { fit: 'cover' })
    .composite([
      { input: circleMask, blend: 'dest-in' },
      { input: goldBorderRing, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Save multiple standard sizes with transparent outside
  await sharp(circular512).resize(32, 32).png().toFile(path.join(__dirname, '../public/favicon.png'));
  await sharp(circular512).resize(48, 48).png().toFile(path.join(__dirname, '../public/favicon.ico'));
  await sharp(circular512).resize(180, 180).png().toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
  await sharp(circular512).resize(192, 192).png().toFile(path.join(__dirname, '../public/icon-192.png'));
  await sharp(circular512).resize(512, 512).png().toFile(path.join(__dirname, '../public/icon-512.png'));
  await sharp(circular512).toFile(path.join(__dirname, '../public/logo-circle.png'));

  console.log('Circular favicons and app icons generated successfully with transparent corners!');
}

makeCircularFavicons().catch(console.error);
