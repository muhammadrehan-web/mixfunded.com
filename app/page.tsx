import Challenges from "@/components/Challenges";
import FinalCta, { Footer } from "@/components/FinalCta";
import FourRules from "@/components/FourRules";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Ledger from "@/components/Ledger";
import Marquee from "@/components/Marquee";
import Perks from "@/components/Perks";
import Stats from "@/components/Stats";
import Steps from "@/components/Steps";
import Support from "@/components/Support";
import TeamNote from "@/components/TeamNote";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Stats />
        <Challenges />
        <Ledger />
        <Steps />
        <Perks />
        <TeamNote />
        <FourRules />
        <Support />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
