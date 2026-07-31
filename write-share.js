const fs = require('fs');

let c = fs.readFileSync('app/page.tsx', 'utf8');

c = c.replace(
  `          <span style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: "999px",
            marginBottom: "24px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Limited Spots
          </span>

          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Founding Organizer Program
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}>
            We are inviting a select group of early organizers to shape the future of
            Venew from the very beginning. Your discoveries, your feedback, and your
            presence will help build Africa&apos;s most important discovery platform.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
            textAlign: "left",
          }}>
            {[
              { icon: "⭐", text: "Priority feature placement on homepage" },
              { icon: "✅", text: "Founding Organizer verified badge" },
              { icon: "🆓", text: "Free listings during launch phase" },
              { icon: "🤝", text: "Direct access to Venew founding team" },
              { icon: "📊", text: "Early access to discovery analytics" },
              { icon: "🚀", text: "Shape the future direction of Venew" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #F5A62330",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "20px" }}>{icon}</span>
                <p style={{ color: "#E8E8E8", fontSize: "14px", lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          <Link href="/submit" style={{
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "16px",
            padding: "16px 40px",
            borderRadius: "12px",
            textDecoration: "none",
            display: "inline-block",
          }}>
            👉 Join the Founding Organizer Program
          </Link>`,
  `          <span style={{
            display: "inline-block",
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: "999px",
            marginBottom: "24px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Limited Founding Cohort
          </span>

          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Become a Founding Discovery Partner
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "16px",
          }}>
            We are inviting the first 100 organisations, businesses, communities,
            institutions, and individuals to help shape the future of Venew.
          </p>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}>
            If you publish opportunities, events, scholarships, grants, fellowships,
            internships, jobs, competitions, learning resources, or community programmes,
            this is your opportunity to become one of Venew&apos;s Founding Discovery Partners.
            Your discoveries, feedback, and early participation will help build
            Africa&apos;s trusted platform for discovering opportunities that help
            people learn, grow, and succeed.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
            textAlign: "left",
          }}>
            {[
              { icon: "⭐", text: "Priority visibility across Venew" },
              { icon: "✅", text: "Official Founding Discovery Partner badge" },
              { icon: "🆓", text: "Free discovery listings during the launch phase" },
              { icon: "🤝", text: "Direct access to the Venew founding team" },
              { icon: "📊", text: "Early access to discovery insights and analytics" },
              { icon: "🚀", text: "Opportunity to influence the future direction of Venew" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #F5A62330",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "20px" }}>{icon}</span>
                <p style={{ color: "#E8E8E8", fontSize: "14px", lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          <Link href="/submit" style={{
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "16px",
            padding: "16px 40px",
            borderRadius: "12px",
            textDecoration: "none",
            display: "inline-block",
          }}>
            👉 Become a Founding Discovery Partner
          </Link>`
);

fs.writeFileSync('app/page.tsx', c);
console.log(c.includes('Founding Discovery Partner') ? 'SUCCESS!' : 'FAILED');