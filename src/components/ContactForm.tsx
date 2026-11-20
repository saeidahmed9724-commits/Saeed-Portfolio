import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { siteConfig } from "../config/site";
import { submitContactMessage } from "../lib/api";
import { validateContactInput } from "../lib/portfolioLogic";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"name" | "email" | "message", string>>
  >({});

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappPrefill
  )}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setFeedback("");

    if (honeypot.trim().length > 0) {
      setStatus("success");
      setFeedback("Message sent! Saeed will get back to you within 24 hours.");
      return;
    }

    const validation = validateContactInput({ name, email, message });
    if (!validation.valid || !validation.sanitized) {
      setFieldErrors(validation.errors);
      setStatus("error");
      setFeedback("Please check the highlighted fields before sending.");
      return;
    }

    setStatus("submitting");
    try {
      await submitContactMessage({
        ...validation.sanitized,
        honeypot,
      });

      setStatus("success");
      setFeedback("Message sent! Saeed will get back to you within 24 hours.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Could not send your message right now.";
      setStatus("error");
      setFeedback(errMsg);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left channels */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <SectionHeading
                eyebrow="Let's Talk"
                heading="Ready to upgrade your social feed?"
                subline="Tell me about your brand, upcoming launch, or monthly creative needs. I reply quickly to every inquiry."
              />

              <Reveal delay={0.12} className="mt-8 space-y-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-white">
                      <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-heading text-base font-bold text-foreground">
                        Chat on WhatsApp
                      </p>
                      <p className="text-sm text-muted">
                        Fastest response for project briefs
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent-ink">
                    Message →
                  </span>
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center justify-between rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-accent/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-accent-ink">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-base font-bold text-foreground">
                        Email directly
                      </p>
                      <p className="truncate text-sm text-muted">
                        {siteConfig.email}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent-ink">
                    Send →
                  </span>
                </a>
              </Reveal>
            </div>

            <Reveal delay={0.16} className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-medium text-muted">Based in</p>
              <p className="mt-1 font-heading text-lg font-bold text-foreground">
                {siteConfig.location} — Working Worldwide
              </p>
            </Reveal>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-soft"
              >
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="company-website">Website</label>
                  <input
                    id="company-website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            name: undefined,
                          }));
                        }
                      }}
                      placeholder="Alex Morgan"
                      aria-invalid={Boolean(fieldErrors.name)}
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-semibold text-foreground"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                        }
                      }}
                      placeholder="alex@brand.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          message: undefined,
                        }));
                      }
                    }}
                    placeholder="Tell me about your brand, deliverables (carousels, ads, monthly pack), and timeline..."
                    aria-invalid={Boolean(fieldErrors.message)}
                    className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div aria-live="polite">
                  <AnimatePresence mode="wait">
                    {status === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-200"
                      >
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden="true"
                        />
                        <span>{feedback}</span>
                      </motion.div>
                    )}

                    {status === "error" && feedback && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200"
                      >
                        <AlertCircle
                          className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                          aria-hidden="true"
                        />
                        <span>{feedback}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted">
                    Typically responds within 24 hours.
                  </p>
                  <MagneticButton
                    type="submit"
                    disabled={status === "submitting"}
                    className="gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-accent transition-colors hover:bg-accent-dark disabled:opacity-60"
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </MagneticButton>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
