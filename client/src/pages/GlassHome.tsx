import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { TiltCard } from "@/components/TiltCard";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import heroBgDefault from "@assets/generated_images/abstract_glassmorphism_hero_background_with_blue_and_purple_gradients.png";
import fashionImgDefault from "@assets/generated_images/fashion_streetwear_design_showcase_for_des_studio.png";
import vehicleImgDefault from "@assets/xe_1767671527677.png";
import posterImgDefault from "@assets/poster_1767671527678.png";
import introImgDefault from "@assets/generated_images/cinematic_motion_graphics_logo_intro_for_des_studio.png";
import logoImgDefault from "@assets/generated_images/high-end_logo_design_showcase_for_des_studio.png";
import motionImgDefault from "@assets/generated_images/video_and_motion_graphics_showcase_for_des_studio.png";

gsap.registerPlugin(ScrollTrigger);

export default function GlassHome() {
  const [services, setServices] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [studioName, setStudioName] = useState("DES STUDIO");
  const [studioLogo, setStudioLogo] = useState("");
  const [discordLink, setDiscordLink] = useState("https://discord.gg/BRTjgZZKge");
  const [heroTitle, setHeroTitle] = useState("DES STUDIO");
  const [heroDescription, setHeroDescription] = useState("Studio thiết kế sáng tạo, high-end chuyên về đồ họa, cinematic intro, poster và concept visual.");
  const [heroBg, setHeroBg] = useState("");
  const [serviceTransitionText, setServiceTransitionText] = useState("DES");
  const [portfolioTransitionText, setPortfolioTransitionText] = useState("DES");
  const [serviceTransitionTitle, setServiceTransitionTitle] = useState("Core Services");
  const [portfolioTransitionTitle, setPortfolioTransitionTitle] = useState("Visual Identity");
  
  const mainRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);

  const convertDriveLink = (url: string) => {
    if (typeof url === "string" && url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
      }
    }
    return url;
  };

  const loadData = () => {
    console.log("Loading data from localStorage...");
    const savedServices = localStorage.getItem("admin_services");
    const savedPortfolio = localStorage.getItem("admin_portfolio");
    const savedSettings = localStorage.getItem("admin_settings");

    if (savedServices) {
      const parsed = JSON.parse(savedServices);
      const withConverted = parsed.map((s: any) => ({
        ...s,
        image: convertDriveLink(s.image)
      }));
      setServices(withConverted);
    } else {
      setServices([
        { id: 1, title: "Thiết kế quần áo", description: "Streetwear, hoodie, apparel concepts with unique graphic typography.", image: fashionImgDefault },
        { id: 2, title: "Xe mod / xe độ", description: "Decal design, wrap concepts, and visual concepts for motorcycles.", image: vehicleImgDefault },
        { id: 3, title: "Poster & Visual Art", description: "Movie posters, event posters, and music visuals.", image: posterImgDefault },
        { id: 4, title: "Intro Cinematic", description: "Cinematic intro videos and high-end motion graphics.", image: introImgDefault },
        { id: 5, title: "Thiết kế Logo", description: "High-end minimalist logo design with elegant typography.", image: logoImgDefault },
        { id: 6, title: "Video & Motion Graphics", description: "Professional video editing and cinematic motion graphics.", image: motionImgDefault },
      ]);
    }

    if (savedPortfolio) {
      const parsed = JSON.parse(savedPortfolio);
      const withDefaults = parsed.map((p: any) => ({
        ...p,
        image: convertDriveLink(p.image) || posterImgDefault
      }));
      setPortfolio(withDefaults);
    } else {
      setPortfolio([
        { id: 1, title: "Cyberpunk Visual Art 2024", category: "Poster", image: posterImgDefault }
      ]);
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setStudioName(settings.studioName || "Loz Phat");
      setStudioLogo(convertDriveLink(settings.studioLogo) || "");
      setDiscordLink(settings.discordLink || "https://discord.gg/BRTjgZZKge");
      setHeroTitle(settings.heroTitle || "Loz Phat");
      setHeroDescription(settings.heroDescription || "Studio thiết kế sáng tạo, high-end chuyên về đồ họa, cinematic intro, poster và concept visual.");
      setHeroBg(settings.heroBg || "");
      setServiceTransitionText(settings.serviceTransitionText || "DES");
      setPortfolioTransitionText(settings.portfolioTransitionText || "DES");
      setServiceTransitionTitle(settings.serviceTransitionTitle || "Core Services");
      setPortfolioTransitionTitle(settings.portfolioTransitionTitle || "Visual Identity");
    } else {
      // Set defaults if no settings exist
      setStudioName("Loz Phat");
      setDiscordLink("https://discord.gg/BRTjgZZKge");
      setHeroTitle("Loz Phat");
      setHeroDescription("Studio thiết kế sáng tạo, high-end chuyên về đồ họa, cinematic intro, poster và concept visual.");
      setServiceTransitionText("DES");
      setPortfolioTransitionText("DES");
      setServiceTransitionTitle("Core Services");
      setPortfolioTransitionTitle("Visual Identity");
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);

    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const sections = gsap.utils.toArray('section');
    let currentSectionIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'd' || key === 'e' || key === 's') {
        if (key === 'd') currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        if (key === 's') currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        
        lenis.scrollTo(sections[currentSectionIndex] as HTMLElement, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Unified Cinematic Timeline: DES -> Core Services
    const tlServices = gsap.timeline({
      scrollTrigger: {
        trigger: "#des-transition",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
      }
    });

    tlServices
      .fromTo("#des-big-text", 
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }
      )
      .fromTo("#features-reveal", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.5"
      );

    // Unified Cinematic Timeline: DES -> Portfolio
    const tlPortfolio = gsap.timeline({
      scrollTrigger: {
        trigger: "#gallery-transition",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
      }
    });

    tlPortfolio
      .fromTo("#des-portfolio-text", 
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1 }
      )
      .fromTo("#portfolio-reveal", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.5"
      );

    // Simplified & Elegant Section Transitions
    sections.forEach((section: any, index: number) => {
      if (section.id === "home" || section.id === "gallery-transition" || section.id === "des-transition") return;

      gsap.fromTo(section,
        { opacity: 0, scale: 0.98, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 30%",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    // Elegant Stagger for items inside sections
    const staggerItems = document.querySelectorAll('.glass-card, .glass-blob, #gallery-text-side, #gallery-image-side');
    gsap.fromTo(staggerItems,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: staggerItems[0],
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Hero Parallax
    gsap.to(heroImageRef.current, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('keydown', handleKeyDown);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen w-full relative overflow-x-hidden text-white font-sans selection:bg-cyan-500/30">
      <div className="glass-bg-container">
        <div className="glass-blob glass-blob-1" />
        <div className="glass-blob glass-blob-2" />
        <div className="glass-blob glass-blob-3" />
      </div>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img ref={heroImageRef} src={heroBg || heroBgDefault} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,40%,5%)] via-[hsl(220,40%,5%)]/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass text-sm font-semibold tracking-wider text-cyan-300 uppercase">Creative Design Studio</div>
            <h1 className="text-6xl md:text-9xl font-display font-bold leading-none mb-6">
              {heroTitle.split(' ').length > 1 ? (
                <>
                  {heroTitle.split(' ')[0]} <br />
                  <span className="text-glow text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                    {heroTitle.split(' ').slice(1).join(' ')}
                  </span>
                </>
              ) : heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 mb-10 max-w-xl leading-relaxed">{heroDescription}</p>
            <div className="flex flex-wrap gap-6">
              <a href={discordLink} target="_blank" rel="noopener noreferrer" className="btn-cinematic px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_rgba(6,182,212,0.7)] text-center">View Portfolio</a>
              <a href={discordLink} target="_blank" rel="noopener noreferrer" className="btn-cinematic px-10 py-5 rounded-full glass text-white font-semibold text-xl hover:bg-white/10 text-center">Start a Project</a>
            </div>
          </div>

          <div className="relative hidden lg:block">
             <TiltCard className="glass-card p-10 rounded-[3rem] max-w-md ml-auto backdrop-blur-3xl border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
               <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="flex items-center gap-6 mb-8">
                    {studioLogo ? (
                      <img src={studioLogo} className="w-16 h-16 rounded-full object-cover border border-white/10 shadow-lg shadow-cyan-500/20" alt="Logo" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20" />
                    )}
                    <div>
                      <div className="text-white font-bold text-2xl tracking-tight">{studioName}</div>
                      <div className="text-cyan-400/80 text-sm uppercase tracking-widest font-bold">Premium Visuals</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-56 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 overflow-hidden shadow-inner relative group">
                       <img src={introImgDefault} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-white/10 rounded-full" />
                      <div className="h-3 w-4/5 bg-white/10 rounded-full" />
                    </div>
                  </div>
               </motion.div>
             </TiltCard>
          </div>
        </div>
      </section>

      {/* Transition Section "DES" -> Core Services */}
      <section id="des-transition" className="h-[100vh] flex items-center justify-center relative z-20 overflow-hidden bg-[hsl(220,40%,5%)]">
        <div className="relative flex items-center justify-center w-full h-full">
          <h1 id="des-big-text" className="absolute text-[25vw] font-display font-black text-white select-none uppercase z-10 opacity-0">{serviceTransitionText}</h1>
          <div id="features-reveal" className="container mx-auto px-6 relative z-20 text-center">
            <h2 id="services-title" className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter opacity-0">
              {serviceTransitionTitle.includes(' ') ? (
                <>
                  {serviceTransitionTitle.split(' ')[0]} <span className="text-cyan-400">{serviceTransitionTitle.split(' ').slice(1).join(' ')}</span>
                </>
              ) : serviceTransitionTitle}
            </h2>
            <p className="text-blue-100/60 max-w-2xl mx-auto text-lg mt-4">Elevating brands through cinematic and futuristic visual storytelling.</p>
          </div>
        </div>
      </section>

      {/* Services Section Grid */}
      <section id="features" className="py-24 relative z-10 overflow-hidden bg-[hsl(220,40%,5%)]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <GlassCard key={service.id} id={service.id} title={service.title} description={service.description || "Thiết kế chuyên nghiệp."} image={service.image} delay={index * 0.1} href={discordLink} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Highlight Transition */}
      <section id="gallery-transition" className="h-[100vh] flex items-center justify-center relative z-20 overflow-hidden bg-[hsl(220,40%,5%)]">
        <div className="relative flex items-center justify-center w-full h-full">
          <h1 id="des-portfolio-text" className="absolute text-[25vw] font-display font-black text-white select-none uppercase z-10 opacity-0">{portfolioTransitionText}</h1>
          <div id="portfolio-reveal" className="container mx-auto px-6 relative z-20 text-center">
            <h2 id="portfolio-title" className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter opacity-0">
              {portfolioTransitionTitle.includes(' ') ? (
                <>
                  {portfolioTransitionTitle.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">{portfolioTransitionTitle.split(' ').slice(1).join(' ')}</span>
                </>
              ) : portfolioTransitionTitle}
            </h2>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 relative overflow-hidden bg-[hsl(220,40%,5%)]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="glass rounded-[3rem] p-8 md:p-20 border border-white/10 grid lg:grid-cols-2 gap-16 items-center backdrop-blur-2xl">
            <div id="gallery-text-side">
              <div className="flex flex-col gap-4 mb-8">
                {services.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-xl font-display font-medium text-white/90"><div className="w-10 h-px bg-cyan-400/50" />{item.title}</div>
                ))}
              </div>
              <a href={discordLink} className="btn-cinematic inline-block px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium">View Full Portfolio</a>
            </div>
            <div id="gallery-image-side" className="relative aspect-video glass rounded-3xl overflow-hidden shadow-2xl group">
               <img src={portfolio[0]?.image || posterImgDefault} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                  <div><div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-2">Featured Project</div><div className="text-2xl font-bold">{portfolio[0]?.title || "Cyberpunk Visual Art 2024"}</div></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-[hsl(220,40%,5%)]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            {studioLogo ? (
              <img src={studioLogo} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="Logo" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500" />
            )}
            <span className="text-2xl font-bold font-display text-white tracking-tighter">{studioName}</span>
          </div>
          <div className="text-blue-100/40 text-sm">© 2024 {studioName}. Creative Design Studio.</div>
          <div className="flex gap-6">{["Behance", "Instagram", "Facebook"].map(s => <a key={s} href="#" className="text-blue-100/60 hover:text-cyan-300 transition-colors text-sm font-medium">{s}</a>)}</div>
        </div>
      </footer>
    </div>
  );
}
