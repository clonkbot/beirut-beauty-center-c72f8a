import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";

// Generate unique session ID for AI consultant
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Services data
const services = [
  {
    id: "electrolysis",
    title: "Electrolysis",
    subtitle: "Precision Hair Removal",
    description: "The only FDA-approved method for permanent hair removal. Our certified specialists use advanced galvanic and thermolysis techniques for lasting results on all skin types and hair colors.",
    details: ["Facial areas", "Body treatments", "All skin types", "All hair colors"],
  },
  {
    id: "permanent-makeup",
    title: "Permanent Makeup",
    subtitle: "Subtle Enhancement",
    description: "Expertly applied micropigmentation that enhances your natural features. Wake up with perfectly defined brows, lips, and eyes that look effortlessly polished.",
    details: ["Microblading", "Lip blushing", "Eyeliner", "Scar camouflage"],
  },
  {
    id: "facial",
    title: "Facial Rejuvenation",
    subtitle: "Advanced Skin Treatments",
    description: "Non-invasive treatments using cutting-edge technology to restore radiance, improve texture, and address signs of aging with natural-looking results.",
    details: ["Microneedling", "LED therapy", "Chemical peels", "Hydrafacial"],
  },
  {
    id: "body",
    title: "Body Treatments",
    subtitle: "Sculpting & Toning",
    description: "Device-led treatments for body contouring, skin tightening, and cellulite reduction. Precision technology meets personalized care.",
    details: ["Body contouring", "Skin tightening", "Cellulite treatment", "Lymphatic drainage"],
  },
];

// FAQ data
const faqs = [
  {
    q: "How many sessions will I need?",
    a: "The number of sessions varies based on the treatment area, your individual needs, and your goals. During your consultation, we'll create a personalized treatment plan with realistic expectations for your specific situation.",
  },
  {
    q: "Is electrolysis really permanent?",
    a: "Yes, electrolysis is the only method recognized by the FDA as permanent hair removal. Once a hair follicle is successfully treated, that follicle will not produce hair again. Multiple sessions are needed as hair grows in cycles.",
  },
  {
    q: "What should I expect during my first visit?",
    a: "Your first visit includes a thorough consultation where we assess your concerns, discuss your goals, and recommend appropriate treatments. We take time to understand your needs before any treatment begins.",
  },
  {
    q: "How do you ensure hygiene and safety?",
    a: "We maintain rigorous sterilization protocols. All tools are either single-use or autoclave-sterilized. Our treatment rooms meet medical-grade hygiene standards, and our practitioners are fully certified.",
  },
  {
    q: "Can I see before and after results?",
    a: "We maintain a portfolio of results from past clients (with their permission). During your consultation, we can show you relevant examples to help set realistic expectations for your treatment.",
  },
];

function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConsultantModal, setShowConsultantModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#2C2825] font-sans">
      <Navigation
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onBookClick={() => setShowBookingForm(true)}
      />

      <main>
        <HeroSection onBookClick={() => setShowBookingForm(true)} onConsultantClick={() => setShowConsultantModal(true)} />
        <TrustStrip />
        <ServicesSection />
        <WhyChooseSection />
        <ProcessSection />
        <TestimonialsSection />
        <ResultsSection />
        <FAQSection />
        <ContactSection onBookClick={() => setShowBookingForm(true)} />
      </main>

      <Footer />

      <MobileBookingBar onBookClick={() => setShowBookingForm(true)} />

      {showBookingForm && (
        <BookingModal onClose={() => setShowBookingForm(false)} />
      )}

      {showConsultantModal && (
        <AIConsultantModal onClose={() => setShowConsultantModal(false)} />
      )}
    </div>
  );
}

function Navigation({
  currentSection,
  setCurrentSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  onBookClick,
}: {
  currentSection: string;
  setCurrentSection: (s: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (b: boolean) => void;
  onBookClick: () => void;
}) {
  const navItems = [
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "results", label: "Results" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F7]/95 backdrop-blur-sm border-b border-[#E8E4DF]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex flex-col leading-tight"
          >
            <span className="font-serif text-lg md:text-xl tracking-wide text-[#2C2825]">
              Beirut Beauty Center
            </span>
            <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#8B7355]">
              Precision Aesthetics
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm tracking-wide text-[#5C5650] hover:text-[#2C2825] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onBookClick}
              className="hidden md:block px-5 py-2.5 bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5A3F3F] transition-colors"
            >
              Book Consultation
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C2825]"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileMenuOpen ? (
                  <path d="M6 6L18 18M6 18L18 6" />
                ) : (
                  <path d="M4 6H20M4 12H20M4 18H20" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#FAF9F7] border-b border-[#E8E4DF] shadow-lg">
          <nav className="flex flex-col py-4 px-5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-base text-[#5C5650] hover:text-[#2C2825] transition-colors border-b border-[#E8E4DF] last:border-0"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="mt-4 px-5 py-3 bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5A3F3F] transition-colors"
            >
              Book Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroSection({ onBookClick, onConsultantClick }: { onBookClick: () => void; onConsultantClick: () => void }) {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-20 md:pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[60%] h-[60%] bg-gradient-to-bl from-[#E8E4DF]/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-gradient-to-tr from-[#D4C4B0]/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-xl">
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#8B7355] mb-4 md:mb-6">
              Sin El Fil, Beirut
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-[#2C2825] mb-6 md:mb-8">
              Expertise you can trust.
              <span className="block text-[#6B4E4E]">Results you can see.</span>
            </h1>

            <p className="text-base md:text-lg text-[#5C5650] leading-relaxed mb-8 md:mb-10 max-w-md">
              Beirut Beauty Center offers advanced, device-led aesthetic treatments delivered with precision, discretion, and genuine care. From permanent hair removal to subtle enhancement, we help you feel confident in your own skin.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onBookClick}
                className="px-6 md:px-8 py-3.5 md:py-4 bg-[#6B4E4E] text-white text-sm md:text-base tracking-wide hover:bg-[#5A3F3F] transition-colors text-center"
              >
                Book a Consultation
              </button>

              <button
                onClick={onConsultantClick}
                className="px-6 md:px-8 py-3.5 md:py-4 border border-[#8B7355] text-[#6B4E4E] text-sm md:text-base tracking-wide hover:bg-[#8B7355]/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3C7.02944 3 3 7.02944 3 12C3 14.2091 3.82 16.2091 5.17157 17.6569L4 21L7.34315 19.8284C8.79086 21.18 10.7909 22 13 22C17.9706 22 22 17.9706 22 13C22 8.02944 17.9706 4 13 4" />
                  <circle cx="8" cy="12" r="1" fill="currentColor" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <circle cx="16" cy="12" r="1" fill="currentColor" />
                </svg>
                AI Treatment Guide
              </button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#D4C4B0] to-[#C4B4A0] rounded-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-[#8B7355]/40">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#2C2825]/60 to-transparent">
                <p className="text-white/90 text-sm">
                  Expert care in the heart of Beirut
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#6B4E4E] flex items-center justify-center">
              <div className="text-center text-white">
                <span className="block text-3xl font-serif">15+</span>
                <span className="text-xs tracking-wide">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const trustItems = [
    { label: "Certified Specialists", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Medical-Grade Hygiene", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
    { label: "Advanced Technology", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { label: "Personalized Care", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  ];

  return (
    <section className="py-8 md:py-12 border-y border-[#E8E4DF] bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#E8E4DF] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B4E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <span className="text-xs md:text-sm text-[#5C5650] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section id="services" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Our Expertise</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825] mb-4">
            Signature Treatments
          </h2>
          <p className="text-[#5C5650] max-w-lg">
            Each treatment is tailored to your unique needs, delivered by specialists with years of dedicated training.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Service tabs - mobile */}
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 -mx-5 px-5 scrollbar-hide">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => setActiveService(i)}
                className={`flex-shrink-0 px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                  activeService === i
                    ? "bg-[#6B4E4E] text-white"
                    : "bg-[#E8E4DF] text-[#5C5650]"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Service tabs - desktop */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-2">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => setActiveService(i)}
                className={`text-left p-5 transition-all ${
                  activeService === i
                    ? "bg-[#6B4E4E] text-white"
                    : "bg-[#F5F3F0] text-[#5C5650] hover:bg-[#E8E4DF]"
                }`}
              >
                <span className="block font-serif text-lg mb-1">{service.title}</span>
                <span className={`text-sm ${activeService === i ? "text-white/70" : "text-[#8B7355]"}`}>
                  {service.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Service detail */}
          <div className="lg:col-span-8">
            <div className="bg-[#F5F3F0] p-6 md:p-10 lg:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                    {services[activeService].subtitle}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-[#2C2825] mb-4">
                    {services[activeService].title}
                  </h3>
                  <p className="text-[#5C5650] leading-relaxed">
                    {services[activeService].description}
                  </p>
                </div>

                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-[#8B7355] block mb-4">
                    Treatments Include
                  </span>
                  <ul className="space-y-3">
                    {services[activeService].details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#5C5650]">
                        <span className="w-1.5 h-1.5 bg-[#6B4E4E] rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-block mt-8 px-6 py-3 bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5A3F3F] transition-colors"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  const reasons = [
    {
      title: "Precision Over Promises",
      description: "We focus on what actually works. Our treatments are backed by science, delivered by trained specialists, and tailored to your individual needs.",
    },
    {
      title: "Your Comfort, Our Priority",
      description: "From your first consultation to follow-up care, we ensure a discreet, comfortable experience in a welcoming environment.",
    },
    {
      title: "Natural-Looking Results",
      description: "Our goal is enhancement, not transformation. We help you look like the best version of yourself, not someone else.",
    },
    {
      title: "Ongoing Partnership",
      description: "We're invested in your long-term results. Expect honest guidance, realistic timelines, and continued support throughout your journey.",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-[#2C2825]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#C4B4A0] mb-3">Why Beirut Beauty Center</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              Where expertise meets genuine care
            </h2>
            <p className="text-[#A8A29E] leading-relaxed max-w-md">
              For over fifteen years, we've built our reputation on results, not rhetoric. Our specialists bring deep expertise, continuous training, and a genuine commitment to your wellbeing.
            </p>
          </div>

          <div className="space-y-8">
            {reasons.map((reason, i) => (
              <div key={i} className="flex gap-5">
                <span className="text-[#6B4E4E] font-serif text-2xl leading-none mt-1">0{i + 1}</span>
                <div>
                  <h3 className="text-white font-medium mb-2">{reason.title}</h3>
                  <p className="text-[#A8A29E] text-sm leading-relaxed">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Consultation",
      description: "We start with a thorough assessment of your concerns and goals. No pressure, no upselling—just honest guidance.",
    },
    {
      step: "02",
      title: "Treatment Plan",
      description: "Receive a personalized plan with realistic expectations, timeline, and transparent pricing.",
    },
    {
      step: "03",
      title: "Treatment",
      description: "Relax in our comfortable treatment rooms while our specialists deliver precise, careful care.",
    },
    {
      step: "04",
      title: "Follow-Up",
      description: "We monitor your progress and adjust as needed to ensure you achieve optimal results.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Your Journey</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825] mb-4">
            What to Expect
          </h2>
          <p className="text-[#5C5650]">
            A clear, comfortable process from your first visit to lasting results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <span className="font-serif text-5xl md:text-6xl text-[#E8E4DF] block mb-4">{step.step}</span>
              <h3 className="font-serif text-xl text-[#2C2825] mb-3">{step.title}</h3>
              <p className="text-sm text-[#5C5650] leading-relaxed">{step.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-[#E8E4DF] -translate-x-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32 bg-[#F5F3F0]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Client Stories</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-[#5C5650] max-w-lg">
            Real experiences from those who've trusted us with their care.
          </p>
        </div>

        {/* Placeholder for verified Google reviews */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 md:p-8">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="18" height="18" viewBox="0 0 24 24" fill="#C4B4A0" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div className="mb-4 text-[#A8A29E] text-sm italic border-l-2 border-[#E8E4DF] pl-4 py-2">
                [Verified Google review content to be inserted here]
              </div>
              <p className="text-[#5C5650] leading-relaxed mb-4">
                This space is reserved for verified client testimonials from Google Reviews. We display only authentic, verified feedback.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8E4DF] rounded-full flex items-center justify-center">
                  <span className="text-[#8B7355] font-serif">—</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-[#2C2825]">Verified Client</span>
                  <span className="text-xs text-[#8B7355]">Treatment type pending</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#6B4E4E] hover:text-[#5A3F3F] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 16l4-4h-3V8h-2v4H8l4 4z" />
            </svg>
            View all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section id="results" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Visual Evidence</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825] mb-4">
            Results Gallery
          </h2>
          <p className="text-[#5C5650] max-w-lg">
            Before and after documentation from real clients (shown with permission).
          </p>
        </div>

        {/* Placeholder grid for approved before/after images */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group">
              <div className="aspect-square bg-[#E8E4DF] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-[#A8A29E]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#2C2825]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">Before/After — Treatment Type</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#8B7355]">
          Additional results available during your consultation
        </p>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-32 bg-[#F5F3F0]">
      <div className="max-w-3xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Common Questions</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825]">
            Frequently Asked
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4"
              >
                <span className="font-medium text-[#2C2825]">{faq.q}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B7355"
                  strokeWidth="1.5"
                  className={`flex-shrink-0 transition-transform ${openIndex === i ? "rotate-45" : ""}`}
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-[#5C5650] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ onBookClick }: { onBookClick: () => void }) {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8B7355] mb-3">Get in Touch</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#2C2825] mb-6">
              Ready to Begin?
            </h2>
            <p className="text-[#5C5650] leading-relaxed mb-8 max-w-md">
              Your journey starts with a consultation. Reach out to schedule a visit or ask any questions—we're here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E8E4DF] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B4E4E" strokeWidth="1.5">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-[#2C2825] mb-1">Visit Us</span>
                  <span className="text-[#5C5650] text-sm">
                    3rd Floor, Gedco Center<br />
                    Sin El Fil, Beirut, Lebanon
                  </span>
                  <span className="block text-xs text-[#8B7355] mt-1 italic">
                    [Address pending client confirmation]
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#E8E4DF] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B4E4E" strokeWidth="1.5">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-[#2C2825] mb-1">Call Us</span>
                  <a href="tel:+9613700345" className="text-[#5C5650] text-sm hover:text-[#6B4E4E] transition-colors">
                    +961 3 700 345
                  </a>
                  <span className="block text-xs text-[#8B7355] mt-1 italic">
                    [Phone pending confirmation]
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-sm font-medium text-[#2C2825] mb-1">WhatsApp</span>
                  <a
                    href="https://wa.me/9613700345"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5C5650] text-sm hover:text-[#25D366] transition-colors"
                  >
                    Message us directly
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#E8E4DF]">
              <span className="block text-sm font-medium text-[#2C2825] mb-2">Hours</span>
              <p className="text-[#5C5650] text-sm">
                Monday – Saturday: By appointment<br />
                <span className="text-xs text-[#8B7355] italic">[Hours pending client confirmation]</span>
              </p>
            </div>
          </div>

          <div className="bg-[#F5F3F0] p-6 md:p-10">
            <h3 className="font-serif text-2xl text-[#2C2825] mb-2">Book a Consultation</h3>
            <p className="text-[#5C5650] text-sm mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <QuickBookingForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickBookingForm() {
  const createConsultation = useMutation(api.consultations.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createConsultation({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        serviceInterest: formData.get("service") as string,
        message: formData.get("message") as string || undefined,
        preferredContact: formData.get("contact") as string,
      });
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try calling us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[#6B4E4E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B4E4E" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h4 className="font-serif text-xl text-[#2C2825] mb-2">Thank You</h4>
        <p className="text-[#5C5650] text-sm">
          We've received your request and will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm text-[#5C5650] mb-1">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
          placeholder="Your full name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm text-[#5C5650] mb-1">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm text-[#5C5650] mb-1">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
            placeholder="+961 XX XXX XXX"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-sm text-[#5C5650] mb-1">Service Interest *</label>
        <select
          id="service"
          name="service"
          required
          className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
        >
          <option value="">Select a treatment area</option>
          <option value="electrolysis">Electrolysis Hair Removal</option>
          <option value="permanent-makeup">Permanent Makeup</option>
          <option value="facial">Facial Rejuvenation</option>
          <option value="body">Body Treatments</option>
          <option value="multiple">Multiple Services</option>
          <option value="unsure">Not Sure – Need Guidance</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm text-[#5C5650] mb-1">Preferred Contact Method *</label>
        <select
          id="contact"
          name="contact"
          required
          className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
        >
          <option value="phone">Phone Call</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-[#5C5650] mb-1">Additional Notes (optional)</label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors resize-none"
          placeholder="Any specific concerns or questions?"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3.5 bg-[#6B4E4E] text-white text-sm tracking-wide hover:bg-[#5A3F3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          "Request Consultation"
        )}
      </button>
    </form>
  );
}

function BookingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#2C2825]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FAF9F7] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#FAF9F7] p-5 border-b border-[#E8E4DF] flex items-center justify-between">
          <h3 className="font-serif text-xl text-[#2C2825]">Book a Consultation</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#E8E4DF] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C5650" strokeWidth="1.5">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="p-5 md:p-8">
          <QuickBookingForm />
        </div>
      </div>
    </div>
  );
}

function AIConsultantModal({ onClose }: { onClose: () => void }) {
  const chat = useAction(api.ai.chat);
  const createSession = useMutation(api.aiConsultant.createSession);
  const addMessage = useMutation(api.aiConsultant.addMessage);
  const getSession = useQuery(api.aiConsultant.getSession, { sessionId: typeof window !== 'undefined' ? (sessionStorage.getItem('bbc-session') || '') : '' });

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = sessionStorage.getItem('bbc-session');
      if (existing) return existing;
      const newId = generateSessionId();
      sessionStorage.setItem('bbc-session', newId);
      return newId;
    }
    return generateSessionId();
  });

  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I'm here to help you find the right treatment at Beirut Beauty Center. Tell me about your goals or concerns, and I'll guide you toward the most suitable options.\n\nWhat brings you here today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSession({ sessionId });
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const systemPrompt = `You are a knowledgeable and warm consultation assistant for Beirut Beauty Center, a premium aesthetics clinic in Sin El Fil, Beirut, Lebanon. Your role is to:

1. Listen carefully to clients' concerns and goals
2. Ask clarifying questions to understand their needs
3. Provide helpful information about treatments (electrolysis, permanent makeup, facial rejuvenation, body treatments)
4. Guide them toward booking a consultation with our specialists

Important guidelines:
- Be warm, professional, and reassuring
- Never make medical diagnoses or guarantees
- Avoid terms like "pain-free," "instant," "guaranteed," or "permanent" without qualification
- Emphasize that a proper in-person consultation is essential for personalized recommendations
- If asked about pricing, explain that costs vary based on individual needs and are discussed during consultation
- Be honest about what treatments can and cannot achieve
- Our specialties include: electrolysis (permanent hair removal), permanent makeup (microblading, lip blushing, eyeliner), facial treatments (microneedling, LED therapy, chemical peels, hydrafacial), and body treatments (contouring, skin tightening, cellulite treatment)

Keep responses concise but helpful. After understanding their needs, encourage them to book an in-person consultation.`;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await addMessage({ sessionId, role: "user", content: userMessage.content });

      const response = await chat({
        messages: messages.concat(userMessage).map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        systemPrompt,
      });

      const assistantMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
      await addMessage({ sessionId, role: "assistant", content: response });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting right now. Please try again, or contact us directly at +961 3 700 345.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#2C2825]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#FAF9F7] w-full sm:max-w-lg h-[85vh] sm:h-[600px] sm:max-h-[80vh] flex flex-col sm:rounded-none">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-[#E8E4DF] flex items-center justify-between bg-[#FAF9F7]">
          <div>
            <h3 className="font-serif text-lg text-[#2C2825]">Treatment Guide</h3>
            <p className="text-xs text-[#8B7355]">AI-Powered Consultation Assistant</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#E8E4DF] transition-colors rounded-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C5650" strokeWidth="1.5">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 ${
                  msg.role === "user"
                    ? "bg-[#6B4E4E] text-white"
                    : "bg-[#E8E4DF] text-[#2C2825]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#E8E4DF] p-3 flex gap-1">
                <span className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-[#E8E4DF] bg-[#FAF9F7]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-white border border-[#E8E4DF] text-[#2C2825] text-sm focus:outline-none focus:border-[#6B4E4E] transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-[#6B4E4E] text-white hover:bg-[#5A3F3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-[#8B7355] mt-2 text-center">
            This is a guide only. Please book a consultation for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileBookingBar({ onBookClick }: { onBookClick: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF9F7] border-t border-[#E8E4DF] p-3 flex gap-2">
      <a
        href="tel:+9613700345"
        className="flex-1 py-3 border border-[#E8E4DF] text-[#5C5650] text-sm flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </a>
      <a
        href="https://wa.me/9613700345"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-3 bg-[#25D366] text-white text-sm flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      <button
        onClick={onBookClick}
        className="flex-1 py-3 bg-[#6B4E4E] text-white text-sm"
      >
        Book
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pb-20 md:pb-0 bg-[#2C2825] pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#3D3835]">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="font-serif text-xl text-white block mb-1">Beirut Beauty Center</span>
              <span className="text-xs tracking-[0.2em] uppercase text-[#8B7355]">Precision Aesthetics</span>
            </div>
            <p className="text-[#A8A29E] text-sm leading-relaxed max-w-md">
              Advanced aesthetic treatments delivered with expertise, discretion, and genuine care. Your confidence, our commitment.
            </p>
          </div>

          <div>
            <span className="block text-white text-sm font-medium mb-4">Services</span>
            <nav className="space-y-2">
              <a href="#services" className="block text-[#A8A29E] text-sm hover:text-white transition-colors">Electrolysis</a>
              <a href="#services" className="block text-[#A8A29E] text-sm hover:text-white transition-colors">Permanent Makeup</a>
              <a href="#services" className="block text-[#A8A29E] text-sm hover:text-white transition-colors">Facial Treatments</a>
              <a href="#services" className="block text-[#A8A29E] text-sm hover:text-white transition-colors">Body Treatments</a>
            </nav>
          </div>

          <div>
            <span className="block text-white text-sm font-medium mb-4">Contact</span>
            <div className="space-y-2 text-sm">
              <p className="text-[#A8A29E]">Gedco Center, Sin El Fil</p>
              <p className="text-[#A8A29E]">Beirut, Lebanon</p>
              <a href="tel:+9613700345" className="block text-[#A8A29E] hover:text-white transition-colors">+961 3 700 345</a>
            </div>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#5C5650] text-xs">
            © {new Date().getFullYear()} Beirut Beauty Center. All rights reserved.
          </p>
          <p className="text-[#5C5650]/60 text-xs">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;
