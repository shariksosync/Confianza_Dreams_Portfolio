import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  settings: any;
  hero: any;
  about: any;
  contact: any;
  stats: any[];
  why: any[];
  process: any[];
  beforeAfter: any;
  instagram: any[];
}

const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "confianza_main" },
    settings: {
      brand: {
        name: { type: String, default: "Confianza Events & Entertainment" },
        short: { type: String, default: "Confianza" },
        initials: { type: String, default: "C" },
        tagline: { type: String, default: "" },
        logo: { type: String, default: "/logo.png" },
      },
      seo: {
        title: { type: String, default: "Confianza Events — Luxury Wedding Planner in Pune" },
        description: { type: String, default: "Confianza Event's and Entertainment plans, designs and executes luxury weddings, destination weddings and premium events across India." },
      },
      theme: {
        primary: { type: String, default: "#6D4C9B" },
        secondary: { type: String, default: "#C9A227" },
        dark: { type: String, default: "#2B2138" },
      },
      sections: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          enabled: { type: Boolean, default: true },
        },
      ],
    },
    hero: {
      eyebrow: { type: String, default: "Luxury Wedding Planners • Pune" },
      headline: { type: String, default: "Where Weddings Become Stories" },
      subtitle: { type: String, default: "From the first consultation to the final celebration, Confianza crafts personalised, flawlessly executed weddings that your guests will talk about for years." },
      primaryCta: {
        label: { type: String, default: "Book Consultation" },
        href: { type: String, default: "/contact" },
      },
      secondaryCta: {
        label: { type: String, default: "View Portfolio" },
        href: { type: String, default: "/portfolio" },
      },
      images: [{ type: String }],
      floatingStats: [
        {
          value: { type: String },
          label: { type: String },
        },
      ],
    },
    homeStory: {
      eyebrow: { type: String, default: "Our Story & Philosophy" },
      title: { type: String, default: "A Pune Studio Devoted to Weddings That Feel Personal" },
      subtitle: { type: String, default: "Where real emotions meet beautiful design. We create unforgettable weddings made specially for you." },
      badge: { type: String, default: "Since 2018 • Warje, Pune" },
      quote: { type: String, default: "Every love story deserves a stage as breathtaking as the journey itself." },
      quoteAuthor: { type: String, default: "— Ashish Wankhede, Founder" },
      image: { type: String, default: "/images/hero-1.jpg" },
      feature1Title: { type: String, default: "Pan-India Destination" },
      feature1Text: { type: String, default: "From Udaipur palatial courtyards to Goa beachside mandaps." },
      feature1Icon: { type: String, default: "Compass" },
      feature2Title: { type: String, default: "Zero Template Policy" },
      feature2Text: { type: String, default: "Every color theme, flower setup, and schedule is made specially for you." },
      feature2Icon: { type: String, default: "HeartHandshake" },
      storyHeading: { type: String, default: "The Confianza Story" },
      storyText: { type: String, default: "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India." },
      missionLabel: { type: String, default: "Our Mission" },
      missionText: { type: String, default: "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for." },
      visionLabel: { type: String, default: "Our Vision" },
      visionText: { type: String, default: "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to." },
      pillarsHeading: { type: String, default: "Our Three Pillars of Excellence" },
      pillars: [
        {
          title: { type: String },
          text: { type: String },
        },
      ],
      ctaLabel: { type: String, default: "Learn More About Us & Our Team" },
      ctaLink: { type: String, default: "/about" },
    },
    about: {
      heading: { type: String, default: "Where Weddings Become Stories" },
      story: { type: String },
      headerBanner: {
        badge: { type: String, default: "Since 2018 • Warje, Pune" },
        title: { type: String, default: "Where Weddings Become Stories" },
        subtitle: {
          type: String,
          default:
            "At Confianza, we're the romantic and elegant wedding experts who bring love stories to life with passion and precision. For us, your event is no less than our own.",
        },
        image: { type: String, default: "/images/hero-1.jpg" },
      },
      homepageHeading: { type: String, default: "A Pune Studio Devoted to Weddings That Feel Personal" },
      homepageStory: {
        type: String,
        default:
          "Confianza began in 2018 with one belief — a wedding should sound like the couple, not like a catalogue. What started as a two-person decor team in Warje is now a full-service house planning, designing and executing weddings across India.",
      },
      mission: { type: String, default: "To take the weight of planning off a family's shoulders and hand back a celebration they can be fully present for." },
      vision: { type: String, default: "To be the most trusted and admired name in personalised luxury weddings across Maharashtra and every landmark destination we travel to." },
      founderAddress: {
        badge: { type: String, default: "FOUNDER'S VISION" },
        eyebrow: { type: String, default: "FOUNDER'S ADDRESS" },
        quote: { type: String, default: "We don't just decorate halls; we architect emotional memories that outlast generations." },
        image: { type: String, default: "/images/couple.jpg" },
        name: { type: String, default: "Mr. Ashish Wankhede" },
        role: { type: String, default: "Founder & Managing Director" },
        story: {
          type: String,
          default:
            "When we founded Confianza Event's and Entertainment, our singular mission was to bring authenticity, structured elegance, and heartfelt reverence back to Indian wedding celebrations.\n\nIn a country rich with boundless traditions and royal heritage, our couples deserve bespoke spatial styling, transparent budgeting, and calm, legitimate execution that elevates their special day from a routine banquet into a cinematic family heirloom.\n\nWe pledge our continuous dedication to nurturing not just flawless events, but lifelong relationships with the families who place their deepest faith in our hands.",
        },
        signatureName: { type: String, default: "Mr. Ashish Wankhede" },
        signatureTitle: { type: String, default: "Founder & Principal Director, Confianza Events" },
      },
      visionPillars: [
        { type: String },
      ],
      missionCommitments: [
        { type: String },
      ],
      coreValues: [
        {
          icon: { type: String, default: "ShieldCheck" },
          title: { type: String, required: true },
          subtitle: { type: String, default: "" },
          text: { type: String, required: true },
          gradient: { type: String, default: "from-secondary to-amber-500" },
        },
      ],
      howWeWork: [
        {
          num: { type: String, required: true },
          title: { type: String, required: true },
          timeline: { type: String, default: "" },
          summary: { type: String, required: true },
          deliverables: [{ type: String }],
        },
      ],
      values: [
        {
          title: { type: String },
          text: { type: String },
        },
      ],
      timeline: [
        {
          year: { type: String },
          text: { type: String },
        },
      ],
    },
    contact: {
      business: { type: String, default: "Confianza Event's and Entertainment" },
      owner: { type: String, default: "Ashish Wankhede" },
      phone: { type: String, default: "9850983389" },
      whatsapp: { type: String, default: "919850983389" },
      email: { type: String, default: "Confianza@supportgmail.com" },
      instagram: { type: String, default: "https://www.instagram.com/confianza_events" },
      address: {
        line1: { type: String, default: "Indrayani Complex" },
        line2: { type: String, default: "Near Mr DIY, Warje Jakat Naka" },
        city: { type: String, default: "Pune" },
        state: { type: String, default: "Maharashtra" },
        pincode: { type: String, default: "411052" },
      },
      mapEmbed: { type: String },
      hours: [
        {
          day: { type: String },
          time: { type: String },
        },
      ],
      socials: [
        {
          label: { type: String },
          href: { type: String },
        },
      ],
    },
    stats: [
      {
        id: { type: Number },
        value: { type: Number },
        suffix: { type: String },
        label: { type: String },
      },
    ],
    why: [
      {
        icon: { type: String },
        title: { type: String },
        text: { type: String },
      },
    ],
    process: [
      {
        id: { type: Number },
        title: { type: String },
        text: { type: String },
      },
    ],
    beforeAfter: {
      before: { type: String },
      after: { type: String },
      title: { type: String },
      text: { type: String },
    },
    instagram: [
      {
        id: { type: Schema.Types.Mixed, required: true },
        image: { type: String, required: true },
        likes: { type: Number, default: 0 },
        caption: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    serviceCategories: [
      {
        id: { type: String, required: true },
        label: { type: String },
        name: { type: String },
        slug: { type: String },
        order: { type: Number, default: 0 },
      },
    ],
    ceremonies: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        subtitle: { type: String, default: "" },
        description: { type: String, required: true },
        image: { type: String, default: "" },
        theme: { type: String, default: "Confianza Signature" },
        highlights: [{ type: String }],
        order: { type: Number, default: 0 },
      },
    ],
    stationery: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
        description: { type: String, required: true },
        image: { type: String, default: "" },
        badge: { type: String, default: "Event Branding" },
        order: { type: Number, default: 0 },
      },
    ],
    servicesCta: {
      eyebrow: { type: String, default: "WHERE WEDDINGS BECOME STORIES" },
      headline: { type: String, default: "Ready to Begin Curating Your Wedding?" },
      subtitle: {
        type: String,
        default:
          "Book a private 60–90 minute consultation with Ashish Wankhede in Warje, Pune, or via virtual video call.",
      },
      buttonText: { type: String, default: "Book Your Free Consultation" },
      buttonLink: { type: String, default: "/contact" },
      notice: { type: String, default: "Free Consultation • No Commitment Required" },
      perks: [
        { type: String },
      ],
    },
    portfolioHeader: {
      badge: { type: String, default: "500+ Happy Weddings" },
      eyebrow: { type: String, default: "OUR WORKS" },
      title: { type: String, default: "Our Works" },
      subtitle: {
        type: String,
        default:
          "Explore photos of our mandap decor, flower setups, beach weddings, and grand reception stages created across India.",
      },
      image: { type: String, default: "/images/hero-2.jpg" },
      stats: [{ type: String }],
    },
    portfolioSection: {
      eyebrow: { type: String, default: "Our Works" },
      title: { type: String, default: "Memorable Moments, Big and Small" },
      subtitle: {
        type: String,
        default:
          "Look through photos of our past weddings, from colorful haldi setups and grand stages to beautiful destination celebrations planned by Ashish Wankhede and Rutik Pund.",
      },
    },
    portfolioCategories: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    portfolioCta: {
      eyebrow: { type: String, default: "LET'S PLAN YOUR SPECIAL DAY" },
      headline: { type: String, default: "Let’s Plan Your Dream Wedding" },
      subtitle: {
        type: String,
        default:
          "Talk directly with Ashish Wankhede and Rutik Pund. We will help you pick a venue, show you 3D decor designs, and handle every detail from start to finish.",
      },
      buttonText: { type: String, default: "Book Free Consultation" },
      buttonLink: { type: String, default: "/contact" },
      notice: { type: String, default: "Free Consultation • No Obligation" },
      perks: [
        { type: String },
      ],
    },
    testimonialsHeader: {
      badge: { type: String, default: "Couples & Families" },
      eyebrow: { type: String, default: "Words of Gratitude" },
      title: { type: String, default: "Real Stories from Happy Families" },
      subtitle: {
        type: String,
        default:
          "See what couples and their families say about trusting Confianza to design and manage their special day.",
      },
      image: { type: String, default: "https://res.cloudinary.com/kipl0jjw/image/upload/v1791962068/confianza_portfolio/portfolio_hero_banner.jpg" },
      stats: [{ type: String }],
    },
    testimonialsCategories: [
      {
        id: { type: String },
        name: { type: String },
        slug: { type: String },
        order: { type: Number, default: 0 },
      },
    ],
    testimonialsExperience: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        description: { type: String },
        icon: { type: String },
        badge: { type: String },
      },
    ],
    testimonialsFaq: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    testimonialsCta: {
      badge: { type: String, default: "Share Your Love Story" },
      headline: { type: String, default: "Were You A Confianza Couple or Guest?" },
      subtitle: { type: String, default: "We would love to hear your memories, photos, and heartfelt reflections of your celebration." },
      buttonText: { type: String, default: "Submit Your Review" },
      secondaryButtonText: { type: String, default: "Book A Consultation" },
    },
    galleryHeader: {
      badge: { type: String, default: "Curated Visual Archive" },
      eyebrow: { type: String, default: "VISUAL INSPIRATIONS" },
      title: { type: String, default: "The Wedding Gallery" },
      subtitle: {
        type: String,
        default:
          "Immerse yourself in close-up details of floral centerpieces, bridal entries, fairy-lit courtyards, and grand lavender stages.",
      },
      image: { type: String, default: "https://res.cloudinary.com/kipl0jjw/image/upload/v1790838224/confianza_heroes/gallery_hero_banner.jpg" },
      stats: [{ type: String }],
    },
    galleryCategories: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    galleryHighlights: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        description: { type: String },
        icon: { type: String },
        badge: { type: String },
      },
    ],
    instagramHeader: {
      eyebrow: { type: String, default: "Follow Our Journey" },
      title: { type: String, default: "@confianza_events on Instagram" },
      subtitle: {
        type: String,
        default:
          "Behind-the-scenes reels, live setups in Udaipur, Pune, and Goa, and daily wedding decor inspiration.",
      },
      handle: { type: String, default: "@confianza_events" },
      followerCount: { type: String, default: "10K+ Followers" },
      url: { type: String, default: "https://www.instagram.com/confianza_events" },
    },
    galleryCta: {
      eyebrow: { type: String, default: "WHERE WEDDINGS BECOME STORIES" },
      headline: { type: String, default: "Envision Your Wedding in Our Visual Chronicle" },
      subtitle: {
        type: String,
        default:
          "Connect directly with founders Ashish Wankhede and Rutik Pund in Warje, Pune to design your bespoke 3D CAD wedding decor.",
      },
      buttonText: { type: String, default: "Book Your Free Consultation" },
      buttonLink: { type: String, default: "/contact" },
      notice: { type: String, default: "Free 1-on-1 Consultation • Direct Founder Interaction" },
      perks: [{ type: String }],
    },
  },
  { timestamps: true, strict: false }
);

export const SiteContent: Model<ISiteContent> =
  models.SiteContent || model<ISiteContent>("SiteContent", SiteContentSchema);
export default SiteContent;
