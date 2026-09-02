import Navbar from "@/components/Navbar";
import DiscoveryAgentSearch from "@/components/DiscoveryAgentSearch";

export default function DiscoverPage() {
  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />
      <DiscoveryAgentSearch />
    </main>
  );
}