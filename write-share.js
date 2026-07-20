const fs = require('fs');

let c = fs.readFileSync('app/account/page.tsx', 'utf8');

const fn = `
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  `;

c = c.replace(' async function handleSave() {', fn + 'async function handleSave() {');

fs.writeFileSync('app/account/page.tsx', c);
console.log(c.includes('function handleAvatarChange') ? 'SUCCESS!' : 'FAILED');