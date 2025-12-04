export const PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://etran.dev/#person",
  "name": "Erick Tran",
  "alternateName": ["Erick", "enVId-tech"],
  "description": "Full Stack Developer with 3+ years of experience in React, Next.js, Node.js, and modern web technologies. Passionate about building scalable, performant web applications.",
  "url": "https://etran.dev",
  "image": {
    "@type": "ImageObject",
    "url": "https://etran.dev/og-image.jpg",
    "width": 1200,
    "height": 630
  },
  "sameAs": [
    "https://github.com/enVId-tech",
    "https://www.linkedin.com/in/ericktran-cs/"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance / Self-Employed"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "University"
  },
  "knowsAbout": [
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "MongoDB",
    "Express.js",
    "Full Stack Development",
    "Frontend Development",
    "Backend Development",
    "REST APIs",
    "GraphQL",
    "HTML5",
    "CSS3",
    "SCSS",
    "Git",
    "Docker",
    "Vercel",
    "PostgreSQL"
  ],
  "knowsLanguage": ["en"],
  "email": "mailto:erick.tran@etran.dev",
  "nationality": {
    "@type": "Country",
    "name": "United States"
  }
}

export const WebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://etran.dev/#website",
  "name": "Erick Tran Portfolio",
  "description": "Portfolio website showcasing full stack development projects, skills, and professional experience of Erick Tran",
  "url": "https://etran.dev",
  "author": {
    "@id": "https://etran.dev/#person"
  },
  "creator": {
    "@id": "https://etran.dev/#person"
  },
  "publisher": {
    "@id": "https://etran.dev/#person"
  },
  "inLanguage": "en-US",
  "copyrightHolder": {
    "@id": "https://etran.dev/#person"
  },
  "copyrightYear": new Date().getFullYear(),
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://etran.dev/blogs?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const ProfessionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://etran.dev/#service",
  "name": "Erick Tran - Full Stack Development Services",
  "description": "Professional full stack web development services specializing in React, Next.js, Node.js, and TypeScript. Building modern, scalable, and performant web applications.",
  "url": "https://etran.dev",
  "image": "https://etran.dev/og-image.jpg",
  "provider": {
    "@id": "https://etran.dev/#person"
  },
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "serviceType": "Web Development",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Frontend Development",
          "description": "Modern, responsive frontend development using React, Next.js, and TypeScript with focus on performance and user experience"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Backend Development",
          "description": "Scalable backend development using Node.js, Express.js, and MongoDB with RESTful APIs"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Full Stack Development",
          "description": "End-to-end web application development from concept to deployment"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "API Development",
          "description": "RESTful and GraphQL API design and implementation"
        }
      }
    ]
  }
}

export const BreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://etran.dev"
    }
  ]
}

