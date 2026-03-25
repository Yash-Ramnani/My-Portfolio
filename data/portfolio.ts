export type Project = {
  id: string;
  label: string;
  title: string;
  description: string;
  video: string;
  links: Array<{ label: string; href: string }>;
};

export const heroRoles = [
  "FULL STACK DEVELOPER.",
  "WEB DEVELOPER.",
  "AI ENTHUSIAST.",
  "TECH LOVER."
];

export const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];

export const coreSkills = [
  "Problem Solving",
  "Responsive Design",
  "Debugging",
  "API Integration",
  "UI/UX Awareness",
  "Team Collaboration",
  "Project Management"
];

export const techSkills = [
  {
    category: "Frontend",
    items: ["HTML", "CSS", "JavaScript", "Bootstrap", "React.js"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs"]
  },
  {
    category: "Database",
    items: ["MongoDB"]
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code"]
  }
];

export const projects: Project[] = [
  {
    id: "project-1",
    label: "Project-1: Xaviours",
    title: "Xaviours Cloth Store",
    description:
      "Xaviours is a modern clothing store website designed to showcase fashion collections with a clean and stylish layout. Built using HTML, CSS, Bootstrap, and JavaScript, it focuses on responsive design and smooth user interaction.",
    video: "/images/Xaviours.mp4",
    links: [
      { label: "Live Demo", href: "https://yash-ramnani.github.io/Xaviours/Xaviours.html" },
      { label: "Source Code", href: "https://github.com/Yash-Ramnani/Xaviours" }
    ]
  },
  {
    id: "project-2",
    label: "Project-2: Web Security Analyzer",
    title: "Basic Web Security Analyzer",
    description:
      "A beginner-friendly cybersecurity project that analyzes basic web security indicators of a given website. It checks HTTPS usage and the presence of common security-related HTTP headers to help understand web application security fundamentals.",
    video: "/images/security.mp4",
    links: [
      { label: "Source Code", href: "https://github.com/Yash-Ramnani/web_security_analyzer" }
    ]
  },
  {
    id: "project-3",
    label: "Project-3: Password Checker",
    title: "Password Strength Checker",
    description:
      "A cybersecurity-focused tool that evaluates password strength based on length, character complexity, and common security best practices. Built to promote authentication security awareness and secure password habits.",
    video: "/images/Password.mp4",
    links: [
      { label: "Source Code", href: "https://github.com/Yash-Ramnani/password_strength_checker" }
    ]
  },
  {
    id: "project-4",
    label: "Project-4: Francis",
    title: "Francis Store",
    description:
      "Francis Store is a responsive general store website showcasing multiple product categories like groceries and daily essentials. Built using HTML, CSS, Bootstrap, and JavaScript, it focuses on clean UI and smooth user experience.",
    video: "/images/Francis.mp4",
    links: [
      { label: "Live Demo", href: "https://yash-ramnani.github.io/Francis-store/Francis.html" },
      { label: "Source Code", href: "https://github.com/Yash-Ramnani/Francis-store" }
    ]
  },
  {
    id: "project-5",
    label: "Project-5: Portfolio",
    title: "Personal Portfolio Website",
    description:
      "A modern, responsive personal portfolio showcasing my projects, skills, and journey as a BCA student. Built using HTML, CSS, Bootstrap, and JavaScript, with smooth UI interactions and an integrated AI assistant (Tez) to enhance user engagement.",
    video: "/images/Portfolio.mp4",
    links: [
      { label: "Live Demo", href: "https://yash-ramnani.github.io/My-Portfolio/Portfolio.html" },
      { label: "Source Code", href: "https://github.com/Yash-Ramnani/My-Portfolio" }
    ]
  }
];

export const experience = [
  {
    role: "Independent Full Stack Developer",
    period: "2024 - Present",
    description:
      "Building modern, responsive, and scalable web applications with a strong focus on clean UI, performance, and practical problem solving."
  },
  {
    role: "Cybersecurity Project Builder",
    period: "Hands-on Practice",
    description:
      "Created security-focused tools such as a web security analyzer and password strength checker to strengthen secure coding fundamentals."
  },
  {
    role: "Open for Opportunities",
    period: "Current",
    description:
      "Open to internships, freelance work, and entry-level web development roles. Usually responds within 24 hours."
  }
];

export const contact = {
  phoneLabel: "+91 8780486871",
  phoneLink: "tel:+918780486871",
  email: "ramnaniyash32@gmail.com",
  emailLink: "mailto:ramnaniyash32@gmail.com",
  linkedin: "https://linkedin.com/in/yash-ramnani",
  github: "https://github.com/Yash-Ramnani",
  whatsapp: "https://wa.me/918780486871",
  resume: "/assets/Yash_Ramnani_Resume.pdf",
  location: "India",
  remote: "Open to remote opportunities"
};
