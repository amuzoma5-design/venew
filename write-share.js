const fs = require('fs');

// Add Health & Wellness to CategoryFilter icons
let cf = fs.readFileSync('components/CategoryFilter.tsx', 'utf8');
cf = cf.replace(
  'Opportunities: "🚀",',
  'Opportunities: "🚀",\n  "Health & Wellness": "💊",'
);
fs.writeFileSync('components/CategoryFilter.tsx', cf);
console.log(cf.includes('Health & Wellness') ? 'CategoryFilter updated!' : 'CategoryFilter FAILED');

// Add Health & Wellness to EventCard colors
let ec = fs.readFileSync('components/EventCard.tsx', 'utf8');
ec = ec.replace(
  'Opportunities: "#14B8A6",',
  'Opportunities: "#14B8A6",\n  "Health & Wellness": "#EC4899",'
);
fs.writeFileSync('components/EventCard.tsx', ec);
console.log(ec.includes('Health & Wellness') ? 'EventCard updated!' : 'EventCard FAILED');

// Add Health & Wellness to event detail page colors
let ed = fs.readFileSync('app/event/[id]/page.tsx', 'utf8');
ed = ed.replace(
  'Opportunities: "#14B8A6",',
  'Opportunities: "#14B8A6",\n  "Health & Wellness": "#EC4899",'
);
fs.writeFileSync('app/event/[id]/page.tsx', ed);
console.log(ed.includes('Health & Wellness') ? 'Event detail updated!' : 'Event detail FAILED');

// Add Health & Wellness to account page colors
let ac = fs.readFileSync('app/account/page.tsx', 'utf8');
ac = ac.replace(
  'Opportunities: "#14B8A6",',
  'Opportunities: "#14B8A6",\n  "Health & Wellness": "#EC4899",'
);
fs.writeFileSync('app/account/page.tsx', ac);
console.log(ac.includes('Health & Wellness') ? 'Account page updated!' : 'Account page FAILED');

// Add Health & Wellness to dashboard colors
let db = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
db = db.replace(
  'Opportunities: "#14B8A6",',
  'Opportunities: "#14B8A6",\n  "Health & Wellness": "#EC4899",'
);
fs.writeFileSync('app/dashboard/page.tsx', db);
console.log(db.includes('Health & Wellness') ? 'Dashboard updated!' : 'Dashboard FAILED');

// Add Health & Wellness as Discovery Type on submit form
let sf = fs.readFileSync('app/submit/page.tsx', 'utf8');
sf = sf.replace(
  '{ value: "business", label: "📈 Business Opportunity" },',
  '{ value: "business", label: "📈 Business Opportunity" },\n  { value: "health", label: "💊 Health & Wellness" },'
);
fs.writeFileSync('app/submit/page.tsx', sf);
console.log(sf.includes('Health & Wellness') ? 'Submit form updated!' : 'Submit form FAILED');