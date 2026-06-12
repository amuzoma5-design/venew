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
            <span style={{ fontSize: "14px" }}>🇳🇬</span>
            <span style={{ color: "#F5A623", fontSize: "12px", fontWeight: 600 }}>
              Nigeria&apos;s Discovery Platform for Events & Opportunities
            </span>
          </div>

          <h1 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(32px, 6vw, 68px)",
            fontWeight: 900,
            color: "#E8E8E8",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}>
            Discover Events, Opportunities,
            <br />
            <span style={{ color: "#F5A623" }}>Communities & Experiences</span>
            <br />
            That Help You Grow
          </h1>

          <p style={{
            color: "#6B6B6B",
            fontSize: "18px",
            lineHeight: 1.8,
            maxWidth: "640px",
            margin: "0 auto 40px",
          }}>
            Venew helps people discover meaningful events and opportunities
            across Nigeria — while helping organizers reach exactly the right
            audience. From church programs to career opportunities, conferences
            to communities — it all starts here.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/submit" style={{
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
              👉 List Your First Event — Free
            </Link>
            <Link href="/events" style={{
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
              Explore Events →
            </Link>
          </div>

          <p style={{
            color: "#6B6B6B",
            fontSize: "13px",
            marginTop: "20px",
          }}>
            Built for organisers, seekers, and communities across Nigeria and beyond.
          </p>
        </div>
      </section>

      {/* Discover More Than Events Section */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
        background: "radial-gradient(ellipse at top left, rgba(245,166,35,0.05), transparent 60%)",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-block",
            backgroundColor: "#F5A62315",
            color: "#F5A623",
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 14px",
            borderRadius: "999px",
            marginBottom: "24px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Expanding Beyond Events
          </span>

          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Discover More Than
            <span style={{ color: "#F5A623" }}> Events</span>
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            maxWidth: "640px",
            margin: "0 auto 48px",
          }}>
            Venew is expanding beyond event discovery to help people find
            opportunities, communities, and experiences that can improve their
            personal, professional, spiritual, and business lives.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "20px",
          }}>
            {[
              { icon: "🎓", title: "Scholarships & Fellowships", text: "Discover funding opportunities, grants, and fellowships that can change your trajectory" },
              { icon: "💼", title: "Internships & Careers", text: "Find internship programs, job fairs, and career development opportunities near you" },
              { icon: "🎤", title: "Conferences & Workshops", text: "Attend world-class conferences, seminars, and hands-on workshops in your city" },
              { icon: "🤝", title: "Communities & Networks", text: "Connect with professional networks, interest groups, and communities that share your vision" },
              { icon: "🚀", title: "Competitions & Startups", text: "Enter pitch competitions, hackathons, and startup programs designed to accelerate your growth" },
              { icon: "⛪", title: "Church & Spiritual Programs", text: "Discover revivals, conferences, retreats, and spiritual gatherings across Nigeria" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "28px",
                textAlign: "left",
                transition: "border-color 0.2s",
              }}>
                <p style={{ fontSize: "32px", marginBottom: "16px" }}>{icon}</p>
                <h3 style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#E8E8E8",
                  marginBottom: "10px",
                }}>
                  {title}
                </h3>
                <p style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Too many opportunities are
            <span style={{ color: "#F5A623" }}> hidden in plain sight.</span>
          </h2>
          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "48px",
          }}>
            Every day, life-changing events and opportunities happen across
            Nigeria — but most people never hear about them in time. They are
            buried in WhatsApp groups, lost in Instagram posts, poorly
            communicated on blurry flyers, and almost impossible to discover
            unless you already know someone. As a result, attendance stays
            limited and impact stays small — even when the message is powerful.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}>
            {[
              { icon: "📱", text: "Shared only in WhatsApp groups" },
              { icon: "📸", text: "Lost inside Instagram posts" },
              { icon: "🖼️", text: "Blurry flyers with missing info" },
              { icon: "📉", text: "Low reach despite great content" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</p>
                <p style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section style={{
        padding: "80px 24px",
        borderBottom: "1px solid #2A2A2A",
        background: "radial-gradient(ellipse at bottom left, rgba(245,166,35,0.05), transparent 60%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "24px",
          }}>
            Venew gives every opportunity
            <span style={{ color: "#F5A623" }}> a home on the internet.</span>
          </h2>
          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "48px",
          }}>
            Whether you are organising a church program, business conference,
            youth seminar, or community gathering — Venew helps you create a
            clean, structured page that communicates everything clearly and
            makes it easy for the right people to find, share, and attend.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px",
          }}>
            {[
              { icon: "📄", text: "Event title, description and details" },
              { icon: "📍", text: "Venue and time information" },
              { icon: "🎤", text: "Speaker and host information" },
              { icon: "🔗", text: "Registration and attendance links" },
              { icon: "📱", text: "Shareable link for WhatsApp and Instagram" },
              { icon: "🖼️", text: "Upload event image or banner" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "24px",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "32px", marginBottom: "12px" }}>{icon}</p>
                <p style={{ color: "#6B6B6B", fontSize: "14px", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Venew Section */}
      <section style={{ padding: "80px 24px", borderBottom: "1px solid #2A2A2A" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            color: "#E8E8E8",
            marginBottom: "48px",
          }}>
            Why organisers and seekers
            <span style={{ color: "#F5A623" }}> choose Venew</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {[
              { icon: "📣", title: "More Visibility", text: "Your event or opportunity becomes discoverable by people actively looking in your city" },
              { icon: "🔗", title: "One Shareable Link", text: "No more messy flyers. Share one clean link on WhatsApp, Instagram, and everywhere" },
              { icon: "🎯", title: "Reach the Right People", text: "Venew recommends events based on interests, location, and activity — so your audience finds you" },
              { icon: "🧭", title: "Professional Presence", text: "Your event or opportunity looks credible, organised, and worth attending" },
              { icon: "📊", title: "Track Interest", text: "See how many people viewed, saved, and engaged with your event page" },
              { icon: "💰", title: "Drive Registrations", text: "Add your registration or payment link directly — and convert interest into attendance" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                padding: "28px",
                textAlign: "left",
              }}>
                <p style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Founding Partner Section */}
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
            We are inviting a select group of early organisers to shape the
            future of Venew from the very beginning. As a founding organiser,
            you will not just use the platform — you will help define what it
            becomes. Your events, your feedback, and your presence will help
            build Nigeria&apos;s most important discovery platform.
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
              { icon: "✅", text: "Founding Organiser verified badge" },
              { icon: "🆓", text: "Free event listings during launch phase" },
              { icon: "🤝", text: "Direct access to Venew founding team" },
              { icon: "📊", text: "Early access to organiser analytics" },
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
              { step: "01", title: "Create your event or opportunity page", text: "Fill in your details — title, date, venue, speaker, price, image. Takes less than 5 minutes." },
              { step: "02", title: "Add everything your audience needs", text: "Include all the information people need to understand, register, and attend your event or opportunity." },
              { step: "03", title: "Share your unique Venew link everywhere", text: "Copy your link and share on WhatsApp groups, Instagram bio, church announcements, flyers, and more." },
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
            Start sharing your events
            <span style={{ color: "#F5A623" }}> the right way</span>
          </h2>

          <p style={{
            color: "#6B6B6B",
            fontSize: "16px",
            lineHeight: 1.8,
            marginBottom: "40px",
          }}>
            Whether you are hosting a church program, business seminar,
            career fair, startup competition, or community gathering —
            Venew helps you present it better, reach more people, and
            create real impact.
          </p>

          <Link href="/submit" style={{
            backgroundColor: "#F5A623",
            color: "#0D0D0D",
            fontWeight: 700,
            fontSize: "16px",
            padding: "16px 40px",
            borderRadius: "12px",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "16px",
          }}>
            👉 List Your First Event — Free Early Access
          </Link>

          <p style={{
            color: "#6B6B6B",
            fontSize: "13px",
            marginTop: "16px",
          }}>
            Venew — Discover Events. Discover Opportunities.
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
            { label: "Browse Events", href: "/events" },
            { label: "List Your Event", href: "/submit" },
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
          © 2026 Venew.ng — Nigeria&apos;s Discovery Platform for Events and Opportunities
        </p>
      </footer>
    </main>
  );
}