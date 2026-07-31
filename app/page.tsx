import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: "80px 24px 60px",
        background: "radial-gradient(ellipse at top right, rgba(245,166,35,0.1), transparent 60%)",
        borderBottom: "1px solid #2A2A2A",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#1A1A1A",
            border: "1px solid #F5A623",
            borderRadius: "999px",
            padding: "6px 16px",
            marginBottom: "32px",
          }}>
            <span style={{ fontSize: "14px" }}>🌍</span>
            <span style={{ color: "#F5A623", fontSize: "12px", fontWeight: 600 }}>
              Africa&apos;s Discovery Platform
            </span>
          </div>

          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 900,
            color: "#E8E8E8",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}>
            Discover What Can
            <br />
            <span style={{ color: "#F5A623" }}>Move You Forward</span>
          </h1>

          <p style={{
            color: "#6B6B6B",
            fontSize: "18px",
            lineHeight: 1.8,
            maxWidth: "640px",
            margin: "0 auto 40px",
          }}>
            Discover opportunities, scholarships, grants, fellowships, internships,
            jobs, events, competitions, communities, and learning resources —
            all in one trusted place.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/events" style={{
              backgroundColor: "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "16px",
              padding: "16px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}>
              🔍 Explore Discoveries
            </Link>
            <Link href="/submit" style={{
              backgroundColor: "transparent",
              color: "#E8E8E8",
              fontWeight: 600,
              fontSize: "16px",
              padding: "16px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              border: "1px solid #2A2A2A",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}>
              Submit a Discovery →
            </Link>
          </div>

          <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "20px" }}>
            Built for dreamers, builders, and opportunity seekers across Africa.
          </p>
        </div>
      </section>

      {/* Discovery Categories */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "16px",
          }}>
            What Would You Like to
            <span style={{ color: "#F5A623" }}> Discover?</span>
          </h2>
          <p style={{ color: "#6B6B6B", fontSize: "16px", marginBottom: "48px" }}>
            Every category is a doorway to something that can change your life.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "16px",
          }}>
            {[
              { icon: "🎓", label: "Scholarships", color: "#14B8A6" },
              { icon: "💰", label: "Grants & Funding", color: "#10B981" },
              { icon: "💼", label: "Jobs", color: "#3B82F6" },
              { icon: "🏢", label: "Internships", color: "#8B5CF6" },
              { icon: "🌍", label: "Fellowships", color: "#F59E0B" },
              { icon: "🎤", label: "Events", color: "#F43F5E" },
              { icon: "🤝", label: "Communities", color: "#A78BFA" },
              { icon: "🏆", label: "Competitions", color: "#FB7185" },
              { icon: "📚", label: "Learning Resources", color: "#22D3EE" },
              { icon: "🚀", label: "Accelerators", color: "#F97316" },
              { icon: "💊", label: "Health & Wellness", color: "#EC4899" },
            ].map(({ icon, label, color }) => (
              <Link key={label} href="/events" style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  textAlign: "center",
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}>
                  <p style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</p>
                  <p style={{ color: color, fontWeight: 700, fontSize: "13px" }}>{label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discover by Goal */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
        background: "radial-gradient(ellipse at top left, rgba(245,166,35,0.05), transparent 60%)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "16px",
          }}>
            What Would You Like to
            <span style={{ color: "#F5A623" }}> Achieve?</span>
          </h2>
          <p style={{ color: "#6B6B6B", fontSize: "16px", marginBottom: "48px" }}>
            Tell us your goal and we will show you the discoveries that can get you there.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}>
            {[
              { icon: "📖", label: "Learn New Skills", desc: "Courses, workshops and learning resources" },
              { icon: "💰", label: "Get Funding", desc: "Grants, scholarships and investment" },
              { icon: "🏗️", label: "Build My Career", desc: "Jobs, internships and fellowships" },
              { icon: "🤝", label: "Meet New People", desc: "Events, communities and networks" },
              { icon: "📈", label: "Grow My Business", desc: "Accelerators, mentors and markets" },
              { icon: "✈️", label: "Travel", desc: "Fellowships, exchanges and residencies" },
              { icon: "🌱", label: "Volunteer", desc: "Community programmes and causes" },
              { icon: "🏠", label: "Find My Community", desc: "Groups, clubs and networks near you" },
            ].map(({ icon, label, desc }) => (
              <Link key={label} href="/events" style={{ textDecoration: "none" }}>
                <div style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "left",
                  cursor: "pointer",
                }}>
                  <p style={{ fontSize: "28px", marginBottom: "10px" }}>{icon}</p>
                  <p style={{ color: "#E8E8E8", fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>{label}</p>
                  <p style={{ color: "#6B6B6B", fontSize: "12px", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Venew Exists */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Why
            <span style={{ color: "#F5A623" }}> Venew Exists</span>
          </h2>

          <p style={{ color: "#6B6B6B", fontSize: "16px", lineHeight: 1.9, marginBottom: "24px" }}>
            Every day, valuable opportunities are shared across websites, newsletters,
            WhatsApp groups, social media, and online communities.
          </p>
          <p style={{ color: "#6B6B6B", fontSize: "16px", lineHeight: 1.9, marginBottom: "24px" }}>
            Unfortunately, many people only discover them after the deadline has passed.
            The scholarship expired. The event sold out. The grant window closed.
            And another life-changing opportunity was missed — not because the person
            was unqualified, but because the information never reached them in time.
          </p>
          <p style={{ color: "#E8E8E8", fontSize: "18px", lineHeight: 1.9, fontWeight: 600 }}>
            Venew exists to make discovery easier by bringing valuable opportunities
            together in one trusted place, so that no opportunity passes you by.
          </p>
        </div>
      </section>

      {/* Discovery Badges */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
        background: "radial-gradient(ellipse at center, rgba(245,166,35,0.04), transparent 70%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "16px",
          }}>
            Every Discovery is
            <span style={{ color: "#F5A623" }}> Clearly Labelled</span>
          </h2>
          <p style={{ color: "#6B6B6B", fontSize: "16px", marginBottom: "48px" }}>
            We use badges so you can quickly understand what each discovery is and whether it is right for you.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {[
              { label: "✅ Verified", bg: "#10B98120", color: "#10B981" },
              { label: "💰 Fully Funded", bg: "#F5A62320", color: "#F5A623" },
              { label: "🆓 Free", bg: "#14B8A620", color: "#14B8A6" },
              { label: "💻 Online", bg: "#3B82F620", color: "#3B82F6" },
              { label: "🏢 In Person", bg: "#8B5CF620", color: "#8B5CF6" },
              { label: "⏰ Closing Soon", bg: "#F43F5E20", color: "#F43F5E" },
              { label: "⭐ Featured", bg: "#F59E0B20", color: "#F59E0B" },
              { label: "🌍 Open to Africans", bg: "#A78BFA20", color: "#A78BFA" },
            ].map(({ label, bg, color }) => (
              <span key={label} style={{
                fontSize: "13px",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: bg,
                color: color,
                border: "1px solid " + color + "30",
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Organizer */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
        background: "radial-gradient(ellipse at center, rgba(245,166,35,0.06), transparent 70%)",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
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
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "48px",
          }}>
            Get started in
            <span style={{ color: "#F5A623" }}> 3 simple steps</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { step: "01", title: "Create your discovery listing", text: "Fill in the details — title, type, deadline, description, image. Takes less than 5 minutes." },
              { step: "02", title: "Add everything people need to know", text: "Include all the information people need to understand, apply for, or attend your discovery." },
              { step: "03", title: "Share your unique Venew link everywhere", text: "Copy your link and share on WhatsApp groups, Instagram bio, announcements, and more." },
            ].map(({ step, title, text }) => (
              <div key={step} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "28px",
                display: "flex",
                gap: "24px",
                alignItems: "flex-start",
                textAlign: "left",
              }}>
                <span style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "#F5A623",
                  lineHeight: 1,
                  minWidth: "48px",
                }}>
                  {step}
                </span>
                <div>
                  <h3 style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#E8E8E8",
                    marginBottom: "8px",
                  }}>
                    {title}
                  </h3>
                  <p style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Start Discovering
            <span style={{ color: "#F5A623" }}> What Is Next</span>
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}>
            Whether you are looking for funding, a scholarship, a conference,
            an internship, a community, or your next big opportunity —
            Venew helps you discover what matters.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/events" style={{
              backgroundColor: "#F5A623",
              color: "#0D0D0D",
              fontWeight: 700,
              fontSize: "16px",
              padding: "16px 40px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "inline-block",
            }}>
              🔍 Explore Discoveries
            </Link>
            <Link href="/submit" style={{
              backgroundColor: "transparent",
              color: "#E8E8E8",
              fontWeight: 600,
              fontSize: "16px",
              padding: "16px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              border: "1px solid #2A2A2A",
              display: "inline-block",
            }}>
              Submit a Discovery →
            </Link>
          </div>

          <p style={{ color: "#6B6B6B", fontSize: "13px", marginTop: "16px" }}>
            Venew — Discover What Can Move You Forward.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #2A2A2A",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
          <span style={{ color: "#F5A623", fontSize: "20px", fontWeight: 900, fontFamily: "Georgia, serif" }}>VE</span>
          <span style={{ color: "#E8E8E8", fontSize: "20px", fontWeight: 900, fontFamily: "Georgia, serif" }}>NEW</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
          {[
            { label: "Explore Discoveries", href: "/events" },
            { label: "Submit a Discovery", href: "/submit" },
            { label: "Discovery Hub", href: "/blog" },
            { label: "Log In", href: "/auth/login" },
            { label: "Sign Up", href: "/auth/signup" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{
              color: "#6B6B6B",
              fontSize: "13px",
              textDecoration: "none",
            }}>
              {label}
            </Link>
          ))}
        </div>
        <p style={{ color: "#6B6B6B", fontSize: "12px" }}>
          © 2026 Venew.ng — Africa&apos;s Discovery Platform for Opportunities, Events, Communities, and Growth.
        </p>
      </footer>
    </main>
  );
}
