const fs = require('fs');

let c = fs.readFileSync('app/profile/[username]/page.tsx', 'utf8');

// Fix the two column grid to be single column on mobile
c = c.replace(
  'display: "grid", gridTemplateColumns: "1fr 260px", gap: "24px", alignItems: "start", paddingBottom: "80px"',
  'display: "grid", gridTemplateColumns: "1fr", gap: "24px", alignItems: "start", paddingBottom: "80px"'
);

// Fix padding on mobile
c = c.replace(
  'maxWidth: "800px", margin: "0 auto", padding: "0 24px"',
  'maxWidth: "800px", margin: "0 auto", padding: "0 16px"'
);

// Remove sticky positioning from sidebar on mobile
c = c.replace(
  'display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "88px"',
  'display: "flex", flexDirection: "column", gap: "16px"'
);

fs.writeFileSync('app/profile/[username]/page.tsx', c);
console.log('Done!');