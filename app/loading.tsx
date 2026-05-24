import Navbar from "@/components/Navbar";

export default function Loading() {
  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero skeleton */}
      <section style={{ padding: "80px 24px 60px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={skeletonStyle(120, 11)} />
          <div style={{ marginTop: "16px", ...skeletonStyle(400, 64) }} />
          <div style={{ marginTop: "12px", ...skeletonStyle(280, 64) }} />
          <div style={{ marginTop: "24px", ...skeletonStyle(480, 20) }} />
          <div style={{ marginTop: "8px", ...skeletonStyle(360, 20) }} />

          {/* Stats */}
          <div style={{ display: "flex", gap: "48px", marginTop: "40px", marginBottom: "48px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div style={skeletonStyle(60, 36)} />
                <div style={{ marginTop: "6px", ...skeletonStyle(80, 12) }} />
              </div>
            ))}
          </div>

          {/* Search bar skeleton */}
          <div style={{
            ...skeletonStyle(600, 54),
            borderRadius: "999px",
          }} />
        </div>
      </section>

      <div style={{ height: "1px", backgroundColor: "#2A2A2A", margin: "0 24px" }} />

      {/* Events skeleton */}
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={skeletonStyle(200, 28)} />
          <div style={{ marginTop: "8px", ...skeletonStyle(120, 16) }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: "36px",
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                borderRadius: "16px",
                overflow: "hidden",
              }}>
                {/* Card header */}
                <div style={{
                  ...skeletonStyle("100%", 140),
                  borderRadius: 0,
                }} />
                {/* Card body */}
                <div style={{ padding: "20px" }}>
                  <div style={skeletonStyle(140, 12)} />
                  <div style={{ marginTop: "10px", ...skeletonStyle("90%", 22) }} />
                  <div style={{ marginTop: "6px", ...skeletonStyle("70%", 22) }} />
                  <div style={{ marginTop: "12px", ...skeletonStyle("100%", 14) }} />
                  <div style={{ marginTop: "4px", ...skeletonStyle("80%", 14) }} />
                  <div style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid #2A2A2A",
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                    <div style={skeletonStyle(100, 14)} />
                    <div style={skeletonStyle(60, 14)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function skeletonStyle(width: number | string, height: number) {
  return {
    width: typeof width === "number" ? `${width}px` : width,
    height: `${height}px`,
    backgroundColor: "#1A1A1A",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #1A1A1A 25%, #222 50%, #1A1A1A 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };
}