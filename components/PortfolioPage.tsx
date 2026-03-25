"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  contact,
  coreSkills,
  experience,
  heroRoles,
  navItems,
  projects,
  techSkills
} from "@/data/portfolio";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useTypewriter } from "@/hooks/useTypewriter";

const sectionIds = ["home", "about", "skills", "projects", "experience", "contact"];

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const initialContactForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export function PortfolioPage() {
  const scrollActiveId = useScrollSpy(sectionIds);
  const typedText = useTypewriter({ words: heroRoles });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickedActiveId, setClickedActiveId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "My name is Tez. Ask me anything about Yash and this portfolio." }
  ]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormState>(initialContactForm);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactFormFeedback, setContactFormFeedback] = useState<string>("");

  const scrollRegionRef = useRef<HTMLDivElement>(null);

  const activeId = clickedActiveId ?? scrollActiveId;

  const glassCard =
    "rounded-2xl border border-blue-100/20 bg-slate-900/55 shadow-glow backdrop-blur-xl";

  const buttonBase =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:-translate-y-0.5";

  const buttonPrimary =
    `${buttonBase} border border-sky-300/40 bg-gradient-to-r from-sky-600 to-cyan-400 text-slate-950 shadow-neon hover:from-sky-500 hover:to-cyan-300`;

  const buttonGhost =
    `${buttonBase} border border-sky-200/35 bg-slate-900/45 text-slate-100 hover:border-sky-300/70 hover:bg-slate-800/65`;

  const sectionTitleClass = "font-[var(--font-heading)] text-3xl leading-tight text-slate-50 md:text-5xl";

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") {
      return "default";
    }

    const existing = window.localStorage.getItem("tez_session_id");
    if (existing) {
      return existing;
    }

    const generated = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem("tez_session_id", generated);
    return generated;
  }, []);

  useEffect(() => {
    if (clickedActiveId && clickedActiveId === scrollActiveId) {
      setClickedActiveId(null);
    }
  }, [clickedActiveId, scrollActiveId]);

  useEffect(() => {
    const shouldLockBody = mobileMenuOpen || contactModalOpen || chatFullscreen;
    document.body.style.overflow = shouldLockBody ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, contactModalOpen, chatFullscreen]);

  useEffect(() => {
    if (scrollRegionRef.current) {
      scrollRegionRef.current.scrollTop = scrollRegionRef.current.scrollHeight;
    }
  }, [messages, chatOpen, chatFullscreen]);

  const openContactModal = () => {
    setContactModalOpen(true);
    setClickedActiveId("contact");
    setMobileMenuOpen(false);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setContactFormFeedback("");
  };

  const handleNavClick = (id: string) => {
    if (id === "contact") {
      openContactModal();
      return;
    }

    setClickedActiveId(id);
    setMobileMenuOpen(false);
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = chatInput.trim();
    if (!trimmed || isSending) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setChatInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: trimmed, sessionId })
      });

      const data: { reply?: string } = await response.json();
      const reply = data.reply ?? "Tez is having a moment. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Tez is having a moment. Please try again." }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingContact) {
      return;
    }

    const payload = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      message: contactForm.message.trim()
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      setContactFormFeedback("Please fill in all form fields.");
      return;
    }

    setIsSubmittingContact(true);
    setContactFormFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit form");
      }

      setContactForm(initialContactForm);
      setContactFormFeedback("Message sent successfully. I will get back to you soon.");
    } catch (error) {
      console.error(error);
      setContactFormFeedback("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const socialLinks = [
    { label: "LinkedIn", href: contact.linkedin },
    { label: "GitHub", href: contact.github },
    { label: "WhatsApp", href: contact.whatsapp },
    { label: "Email", href: contact.emailLink },
    { label: "Phone", href: contact.phoneLink },
    { label: "Resume", href: contact.resume }
  ];

  const chatWindowClass = chatFullscreen
    ? "fixed inset-2 z-40 flex h-auto w-auto flex-col rounded-2xl border border-sky-100/25 bg-slate-900/95 p-2 shadow-glow backdrop-blur-xl sm:p-3 md:inset-6"
    : "fixed inset-x-2 bottom-24 z-30 flex h-[min(70vh,520px)] max-h-[calc(100vh-6.75rem)] w-auto flex-col rounded-2xl border border-sky-100/25 bg-slate-900/95 p-2 shadow-glow backdrop-blur-xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:h-[650px] sm:max-h-[calc(100vh-1rem)] sm:w-[min(92vw,360px)] sm:p-3";

  return (
    <main className="mx-auto mb-16 w-[min(1160px,calc(100%-1.25rem))] md:w-[min(1160px,calc(100%-2.2rem))]">
      <header className={`${glassCard} sticky top-3 z-30 mt-3 px-4 py-3 md:px-5`}>
        <div className="flex items-center justify-between gap-3">
          <a
            href="#home"
            className="font-[var(--font-heading)] text-lg uppercase tracking-[0.14em] text-slate-200"
          >
            My Portfolio
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200/30 bg-slate-900/65 text-slate-100 transition md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </span>
          </button>

          <nav aria-label="Primary navigation" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const itemId = item.href.replace("#", "");
                const isActive =
                  itemId === "contact"
                    ? contactModalOpen || activeId === "contact"
                    : activeId === itemId;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        if (itemId === "contact") {
                          event.preventDefault();
                        }
                        handleNavClick(itemId);
                      }}
                      className={`rounded-full px-3 py-2 text-xs uppercase tracking-[0.1em] transition ${
                        isActive
                          ? "bg-sky-500/25 text-sky-100"
                          : "text-slate-300 hover:bg-sky-500/20 hover:text-slate-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-20 bg-slate-950/65 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mx-4 mt-24 rounded-2xl border border-sky-100/20 bg-slate-900/95 p-4 shadow-glow"
            onClick={(event) => event.stopPropagation()}
          >
            <ul className="space-y-1">
              {navItems.map((item) => {
                const itemId = item.href.replace("#", "");
                const isActive =
                  itemId === "contact"
                    ? contactModalOpen || activeId === "contact"
                    : activeId === itemId;

                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        if (itemId === "contact") {
                          event.preventDefault();
                        }
                        handleNavClick(itemId);
                      }}
                      className={`block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.1em] transition ${
                        isActive
                          ? "bg-sky-500/25 text-sky-100"
                          : "text-slate-300 hover:bg-slate-800/90 hover:text-slate-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {contactModalOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 p-2 backdrop-blur-sm sm:p-3 md:p-8"
          onClick={closeContactModal}
        >
          <section
            className="mx-auto flex h-full max-h-[calc(100vh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-sky-100/25 bg-slate-900/95 p-3 shadow-glow sm:p-4 md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-2 sm:mb-4 sm:items-center sm:gap-3">
              <h3 className="font-[var(--font-heading)] text-2xl text-slate-100 sm:text-3xl">Contact Yash</h3>
              <button type="button" onClick={closeContactModal} className={buttonGhost}>
                Close
              </button>
            </div>

            <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto pr-1 sm:gap-4 sm:pr-2 lg:grid-cols-[1fr_1.25fr]">
              <aside className="rounded-xl border border-sky-100/20 bg-slate-950/55 p-3 sm:p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.12em] text-slate-400">Social Links</p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className={`${buttonPrimary} w-full sm:w-auto`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <p className="mt-4 rounded-xl border border-sky-100/20 bg-slate-900/70 p-3 text-sm text-slate-300">
                  Usually responds within 24 hours. Open to internships, freelance work, and
                  entry-level web development opportunities.
                </p>
              </aside>

              <form
                onSubmit={handleContactSubmit}
                className="flex min-h-0 w-full flex-col gap-2 rounded-xl border border-sky-100/20 bg-slate-950/55 p-3 sm:gap-3 sm:p-4"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Send a Message</p>

                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  placeholder="Name"
                  className="rounded-xl border border-sky-100/25 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-300/70"
                />

                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  placeholder="Email"
                  className="rounded-xl border border-sky-100/25 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-300/70"
                />

                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  placeholder="Phone Number"
                  className="rounded-xl border border-sky-100/25 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-300/70"
                />

                <textarea
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, message: event.target.value }))
                  }
                  placeholder="Message"
                  className="h-28 w-full max-w-full resize-none overflow-y-auto rounded-xl border border-sky-100/25 bg-slate-900/70 px-3 py-2.5 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-sky-300/70 sm:min-h-[160px] sm:resize-y"
                />

                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className={`${buttonPrimary} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isSubmittingContact ? "Sending..." : "Submit"}
                </button>

                {contactFormFeedback ? (
                  <p className="text-sm text-slate-300">{contactFormFeedback}</p>
                ) : null}
              </form>
            </div>
          </section>
        </div>
      ) : null}

      <section
        id="home"
        className="relative mt-6 grid min-h-0 items-center gap-4 overflow-hidden rounded-3xl border border-blue-100/20 bg-slate-950/35 p-4 sm:gap-6 sm:p-5 md:min-h-[680px] md:grid-cols-[1.05fr_0.95fr] md:p-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-drift bg-[linear-gradient(rgba(85,145,217,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(85,145,217,0.10)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black_38%,transparent_88%)]" />
          <span className="absolute -left-24 -top-16 h-72 w-72 animate-floaty rounded-full bg-sky-400/30 blur-sm" />
          <span className="absolute -right-16 top-10 h-64 w-64 animate-floaty-slow rounded-full bg-slate-200/20 blur-sm" />
          <span className="absolute -bottom-16 right-1/4 h-48 w-48 animate-pulseGlow rounded-full bg-blue-500/40 blur-sm" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center gap-4 rounded-2xl bg-slate-900/30 p-4 sm:gap-6 sm:p-5 md:gap-8 md:p-8">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.14em] text-slate-300 sm:mb-3 sm:text-base">Hi, I&apos;m</p>
            <h1 className="font-[var(--font-heading)] text-[clamp(2.45rem,14vw,7.6rem)] leading-[0.9] text-slate-100 sm:leading-[0.92]">
              YASH
              <span className="block bg-gradient-to-r from-sky-300 via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                RAMNANI
              </span>
            </h1>
            <p className="mt-4 min-h-8 text-xs uppercase tracking-[0.11em] text-slate-300 sm:text-sm md:mt-5 md:text-lg">
              {typedText}
              <span className="animate-blink text-sky-300">|</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a href="#projects" className={buttonPrimary} onClick={() => handleNavClick("projects")}>
              View Projects
            </a>
            <button type="button" className={buttonGhost} onClick={openContactModal}>
              Contact Me
            </button>
          </div>
        </div>

        <div className="relative z-10 hidden items-center justify-center md:flex md:justify-end">
          <Image
            src="/images/developer.png"
            alt="Developer"
            width={560}
            height={560}
            className="h-[280px] w-full max-w-[500px] object-contain p-2 drop-shadow-[0_18px_30px_rgba(11,82,152,0.42)] md:h-[500px] md:w-[500px] md:max-w-none"
            priority
          />
        </div>

      </section>

      <section id="about" className="mt-16">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Profile</p>
          <h2 className={sectionTitleClass}>About Me</h2>
        </div>
        <article className={`${glassCard} p-6`}>
          <p className="leading-8 text-slate-300">
            I&apos;m <strong className="text-slate-100">Yash Ramnani</strong>, a passionate Full
            Stack Developer focused on building clean, responsive, and scalable web applications. I
            enjoy turning ideas into real-world products using modern technologies while keeping
            performance and user experience at the core.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={contact.emailLink} className={buttonPrimary}>
              Email Me
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className={buttonGhost}>
              LinkedIn
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className={buttonGhost}>
              GitHub
            </a>
          </div>
        </article>
      </section>

      <section id="skills" className="mt-16">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Expertise</p>
          <h2 className={sectionTitleClass}>Skills</h2>
        </div>

        <div className={`${glassCard} mb-4 flex flex-wrap gap-2 p-5`}>
          {coreSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-sky-300/35 bg-slate-900/65 px-3 py-2 text-xs uppercase tracking-[0.08em] text-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {techSkills.map((group) => (
            <article key={group.category} className={`${glassCard} p-4`}>
              <h3 className="font-[var(--font-heading)] text-2xl text-slate-100">{group.category}</h3>
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li key={item} className="border-b border-slate-600/30 py-2 text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="mt-16">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Portfolio</p>
          <h2 className={sectionTitleClass}>My Projects</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className={`${glassCard} group flex flex-col gap-3 p-4 transition duration-300 hover:-translate-y-2 hover:border-sky-300/70 hover:shadow-neon`}
            >
              <p className="text-xs uppercase tracking-[0.11em] text-slate-400">{project.label}</p>
              <div className="overflow-hidden rounded-xl border border-sky-200/25">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block h-56 w-full object-cover transition duration-500 group-hover:scale-105 group-hover:saturate-150"
                >
                  <source src={project.video} type="video/mp4" />
                </video>
              </div>
              <h3 className="font-[var(--font-heading)] text-2xl text-slate-100">{project.title}</h3>
              <p className="leading-8 text-slate-300">{project.description}</p>
              <div className="mt-1 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonPrimary}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="mt-16">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Journey</p>
          <h2 className={sectionTitleClass}>Experience</h2>
        </div>

        <div className="grid gap-4">
          {experience.map((item) => (
            <article key={item.role} className={`${glassCard} p-5`}>
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-[var(--font-heading)] text-2xl text-slate-100">{item.role}</h3>
                <span className="text-xs uppercase tracking-[0.12em] text-slate-400">{item.period}</span>
              </div>
              <p className="mt-2 leading-8 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Connect</p>
          <h2 className={sectionTitleClass}>Contact</h2>
        </div>

        <article className={`${glassCard} p-6`}>
          <p className="text-slate-300">
            Open to internships, freelance work, and entry-level web development roles.
          </p>
          <div className="mt-4 grid gap-2">
            <a
              href={contact.phoneLink}
              className="rounded-xl border border-sky-200/30 bg-slate-900/60 px-3 py-3 text-slate-200 transition hover:border-sky-300/70"
            >
              Contact: {contact.phoneLabel}
            </a>
            <a
              href={contact.emailLink}
              className="rounded-xl border border-sky-200/30 bg-slate-900/60 px-3 py-3 text-slate-200 transition hover:border-sky-300/70"
            >
              Email: {contact.email}
            </a>
            <p className="rounded-xl border border-sky-200/30 bg-slate-900/60 px-3 py-3 text-slate-300">
              Location: {contact.location} - {contact.remote}
            </p>
            <p className="rounded-xl border border-sky-200/30 bg-slate-900/60 px-3 py-3 text-slate-300">
              Usually responds within 24 hours
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={contact.emailLink} className={buttonPrimary}>
              Email Me
            </a>
            <a href={contact.whatsapp} target="_blank" rel="noreferrer" className={buttonGhost}>
              WhatsApp Me
            </a>
            <a href={contact.resume} className={buttonGhost} download>
              Resume
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className={buttonGhost}>
              LinkedIn
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className={buttonGhost}>
              GitHub
            </a>
          </div>
        </article>
      </section>

      <button
        type="button"
        onClick={() => {
          setChatOpen((prev) => !prev);
          setChatFullscreen(false);
        }}
        aria-label="Toggle chatbot"
        className="fixed bottom-6 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-sky-200/40 bg-gradient-to-br from-sky-500 to-cyan-300 text-xl text-slate-950 shadow-neon transition hover:-translate-y-1"
      >
        🤖
      </button>

      {chatOpen ? (
        <section className={chatWindowClass}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="font-[var(--font-heading)] text-2xl text-slate-100">Tez</h3>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setChatFullscreen((prev) => !prev)}
                className="rounded-lg border border-sky-200/30 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-slate-200 transition hover:bg-slate-800 sm:text-xs"
              >
                {chatFullscreen ? "Window" : "Full"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatOpen(false);
                  setChatFullscreen(false);
                }}
                className="rounded-lg border border-sky-200/30 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-slate-200 transition hover:bg-slate-800 sm:text-xs"
              >
                Close
              </button>
            </div>
          </div>

          <div
            ref={scrollRegionRef}
            className="min-h-0 flex-1 space-y-2 overflow-y-auto rounded-xl border border-sky-100/20 bg-slate-950/55 p-3"
          >
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`rounded-xl px-3 py-2 text-sm leading-6 ${
                  msg.role === "assistant"
                    ? "mr-3 border border-sky-200/20 bg-slate-900/80 text-slate-100 sm:mr-8"
                    : "ml-3 border border-cyan-200/35 bg-cyan-400/15 text-cyan-100 sm:ml-8"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isSending ? (
              <div className="mr-3 rounded-xl border border-sky-200/20 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 sm:mr-8">
                Tez is typing...
              </div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="mt-3 flex shrink-0 flex-col gap-2 sm:flex-row">
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Type your message"
              className="min-w-0 flex-1 rounded-xl border border-sky-100/25 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-sky-300/70"
            />
            <button
              type="submit"
              disabled={isSending}
              className={`${buttonPrimary} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60`}
            >
              Send
            </button>
          </form>
        </section>
      ) : null}
    </main>
  );
}
