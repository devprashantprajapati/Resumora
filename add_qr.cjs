const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/preview/templates');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add import if missing
  if (!content.includes('ResumeQRCode')) {
    content = content.replace(/(import .* from ['"]@\/types\/resume['"];?)/, "$1\nimport { ResumeQRCode } from '@/components/ui/ResumeQRCode';");
    changed = true;
  }

  // Ensure root div is relative
  // Search for the first `<div className="w-full` and add `relative ` if not there
  if (content.includes('<div className="w-full')) {
     if (!content.includes('<div className="relative w-full') && !content.includes('<div className="w-full relative')) {
        content = content.replace('<div className="w-full', '<div className="relative w-full');
        changed = true;
     }
  }

  // Inject the QR code component just inside the root div, before the header
  if (!content.includes('<ResumeQRCode')) {
      content = content.replace('{/* Header */}', `<div className="absolute top-8 right-8 z-10 hidden sm:block print:block"><ResumeQRCode settings={settings} color={settings.color || '#18181b'} /></div>\n      {/* Header */}`);
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
