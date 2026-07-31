const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  '{ icon: "🚀", label: "Accelerators", color: "#F97316" },',
  '{ icon: "🚀", label: "Accelerators", color: "#F97316" },\n              { icon: "💊", label: "Health & Wellness", color: "#EC4899" },'
);

fs.writeFileSync('app/page.tsx', c);
console.log(c.includes('Health & Wellness') ? 'SUCCESS!' : 'FAILED');