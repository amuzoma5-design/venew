const fs = require('fs');

let c = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Make email shorter on mobile
c = c.replace(
  '                maxWidth: "160px",',
  '                maxWidth: "120px",'
);

fs.writeFileSync('components/Navbar.tsx', c);
console.log('Done!');