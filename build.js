// build.js — runs during Netlify deploy
// Reads index.html, replaces %%TOKEN%% placeholders with env vars, writes to dist/

const fs = require('fs');
const path = require('path');

const REPLACEMENTS = {
  '%%FIREBASE_API_KEY%%':        process.env.FIREBASE_API_KEY,
  '%%FIREBASE_AUTH_DOMAIN%%':    process.env.FIREBASE_AUTH_DOMAIN,
  '%%FIREBASE_PROJECT_ID%%':     process.env.FIREBASE_PROJECT_ID,
  '%%FIREBASE_STORAGE_BUCKET%%': process.env.FIREBASE_STORAGE_BUCKET,
  '%%FIREBASE_MESSAGING_ID%%':   process.env.FIREBASE_MESSAGING_ID,
  '%%FIREBASE_APP_ID%%':         process.env.FIREBASE_APP_ID,
  '%%FIREBASE_MEASUREMENT_ID%%': process.env.FIREBASE_MEASUREMENT_ID,
};

// Check all env vars are present
const missing = Object.entries(REPLACEMENTS)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length > 0) {
  console.error('❌ Missing environment variables:');
  missing.forEach(k => console.error('   ' + k));
  console.error('\nSet these in Netlify → Site configuration → Environment variables');
  process.exit(1);
}

// Create dist folder
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

// Files to copy as-is (no substitution needed)
const copyFiles = ['manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'];

// Process index.html — substitute placeholders
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
for (const [token, value] of Object.entries(REPLACEMENTS)) {
  html = html.replaceAll(token, value);
}
fs.writeFileSync(path.join(distDir, 'index.html'), html);
console.log('✅ index.html processed — secrets injected');

// Copy other files unchanged
for (const file of copyFiles) {
  const src = path.join(__dirname, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log(`✅ ${file} copied`);
  }
}

console.log('\n🎉 Build complete → dist/');
