const fs = require('fs');

let content = fs.readFileSync('components/HomeClient.tsx', 'utf8');

content = content.replace(
  '            }}\n            >\n              Feature My Event\n            </a>',
  '            }}\n            >\n              Feature My Event\n            </a>'
);

// Find the broken spot and fix it
const broken = '              }}\n            >\n              Feature My Event';
const fixed = '              }}\n            >\n              Feature My Event';

// Direct replacement approach
content = content.replace(
  'padding: "8px 16px",\n                borderRadius: "999px",\n                textDecoration: "none",\n                whiteSpace: "nowrap",\n              }}\n            >\n              Feature My Event\n            </a>',
  'padding: "8px 16px",\n                borderRadius: "999px",\n                textDecoration: "none",\n                whiteSpace: "nowrap",\n              }}\n            >\n              Feature My Event\n            </a>'
);

const oldText = `            <p style={{ color: "#E8E8E8", fontSize: "14px" }}>
              Want your event featured at the top?
            </p>
            
              href={waLink}`;

const newText = `            <p style={{ color: "#E8E8E8", fontSize: "14px" }}>
              Want your event featured at the top?
            </p>
            
              href={waLink}`;

content = content.replace(oldText, newText);

fs.writeFileSync('components/HomeClient.tsx', content);
console.log('Done! Lines around fix:');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('Feature My Event'));
console.log(lines.slice(idx-8, idx+3).join('\n'));