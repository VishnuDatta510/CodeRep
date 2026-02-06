// create-icons.js
// Run this with Node.js to create simple PNG icons for the extension
// Usage: node create-icons.js

const fs = require("fs");
const path = require("path");

// Base64 encoded PNG icons (blue background with "CR" text)
// These are pre-generated simple icons

// 16x16 icon
const icon16 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2ElEQVR42mNgGAWjIJQBIyMjAwMDAwMfH9//f/8YGP7+/c/w5+9/BgZGRgYWFhYGJiYmBkZGRoYfP34w/P37l+HPnz8Mf/78YWBhYWFgZGRkYGJiYnj//j3D69evGZ4/f87w+PFjhrdv3zL8/PmT4dOnTwxPnz5lePv2LcO7d+8YXr16xfD8+XOG169fM3z//p3h+/fvDF++fGF4+fIlw5MnTxjevHnD8O3bN4YPHz4w3L9/n+Hu3bsMt27dYrh+/TrD1atXGS5fvsxw8eJFhnPnzjGcOXOG4fTp0wwDDQAAv+w4WZhzR2YAAAAASUVORK5CYII=",
  "base64",
);

// 48x48 icon
const icon48 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA+0lEQVR42u2ZMQ6AIBBEV9NewtY7eAdvQENBYWVhay/xBrbGgoKSghoQJYsss8nwm0kI/wdmgIiICGMAhACs9XcnAIgt4HsK4AYIYwdEBEKYAhGBME4BRCCEKRARCOMUQARCmAIRgTBOAUQghCkQEQjjFEAEQpgCEYEwTgFEIIQpEBEI4xRABEKYAhGBME4BRCCEKRARCOMUQARCmAIRgTBOAUQghCkQEQjjFEAEQpgCEYEwTgFEIIQpEBEI4xRABEKYAhGBME4BRCCEKRARCOMUQARCmAIRgTBOAUQghCm8BRAkJSJBIEmJSBDYfwtJiUgQSH7hRET/tx9CdF2GU3YGFAAAAABJRU5ErkJggg==",
  "base64",
);

// 128x128 icon
const icon128 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAA2klEQVR42u3TAQ0AIAwDwNb/oKMBDpDAAUkECBIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYIECRIkSJAgQYKE/wPvU9WvP3P2fgAAAABJRU5ErkJggg==",
  "base64",
);

const iconsDir = path.join(__dirname, "icons");

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Write icons
fs.writeFileSync(path.join(iconsDir, "icon16.png"), icon16);
fs.writeFileSync(path.join(iconsDir, "icon48.png"), icon48);
fs.writeFileSync(path.join(iconsDir, "icon128.png"), icon128);

console.log("Icons created successfully!");
console.log("- icons/icon16.png");
console.log("- icons/icon48.png");
console.log("- icons/icon128.png");
