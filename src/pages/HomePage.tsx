import { useEffect, useState } from "react";
import type { Work } from "../lib/types";
import { fetchPublishedWorks } from "../lib/api";
import { About } from "../components/About";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Navbar } from "../components/Navbar";
import { Services } from "../components/Services";
import { Testimonials } from "../components/Testimonials";
import { WorkGrid } from "../components/WorkGrid";

export function HomePage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPublishedWorks()
      .then((list) => {
        if (active) setWorks(list);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load portfolio."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Marquee />
        <WorkGrid works={works} isLoading={loading} error={error} />
        <About />
        <Services />
        <Testimonials />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
