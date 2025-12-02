export const PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Erick Tran",
  "alternateName": "Erick",
  "description": "Full Stack Developer with 3+ years of experience in React, Next.js, Node.js, and modern web technologies",
  "url": "https://etran.dev",
  "image": "https://etran.dev/og-image.jpg",
  "sameAs": [
    "https://github.com/enVId-tech",
    "https://www.linkedin.com/in/ericktran-cs/",
    "mailto:erick.tran@etran.dev"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  },
  "alumniOf": {
    "@type": "Organization",
    "name": "University"
  },
  "knowsAbout": [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "MongoDB",
    "Express.js",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development"
  ],
  "email": "erick.tran@etran.dev"
}

export const WebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Erick Tran Portfolio",
  "description": "Portfolio website showcasing full stack development projects and skills",
  "url": "https://etran.dev",
  "author": {
    "@type": "Person",
    "name": "Erick Tran"
  },
  "inLanguage": "en-US",
  "copyrightHolder": {
    "@type": "Person",
    "name": "Erick Tran"
  },
  "copyrightYear": new Date().getFullYear()
}

export const ProfessionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Erick Tran - Full Stack Development Services",
  "description": "Professional full stack web development services specializing in React, Next.js, and Node.js",
  "url": "https://etran.dev",
  "provider": {
    "@type": "Person",
    "name": "Erick Tran"
  },
  "areaServed": "Worldwide",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Frontend Development",
          "description": "React, Next.js, TypeScript frontend development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Backend Development",
          "description": "Node.js, Express.js, MongoDB backend development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Full Stack Development",
          "description": "Complete web application development from frontend to backend"
        }
      }
    ]
  }
}
