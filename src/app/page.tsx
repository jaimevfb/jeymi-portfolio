import Nav from "@/components/Nav";
import IntroLoader from "@/components/IntroLoader";
import Hero from "@/components/Hero";
import WorkMarquee from "@/components/WorkMarquee";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <Nav />
      <main id="main">
        <Hero />
        <WorkMarquee />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
