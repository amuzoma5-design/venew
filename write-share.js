const fs = require('fs');

let c = fs.readFileSync('components/HomeClient.tsx', 'utf8');

// Fix: wrap Feature CTA with user check
c = c.replace(
  '          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "12px", padding: "12px 20px", marginBottom: "32px", flexWrap: "wrap" }}>',
  '          {user && <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", backgroundColor: "#FFF8E7", border: "1px solid #F5A623", borderRadius: "12px", padding: "12px 20px", marginBottom: "32px", flexWrap: "wrap" }}>'
);

c = c.replace(
  '            </a>\n          </div>',
  '            </a>\n          </div>}'
);

fs.writeFileSync('components/HomeClient.tsx', c);
console.log('Done!');