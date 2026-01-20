import React, { useState, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { 
  Bot, 
  Sparkles, 
  Video, 
  Mic, 
  Edit3, 
  Globe, 
  CheckCircle2, 
  Lock, 
  Play, 
  ArrowRight, 
  CreditCard,
  LayoutGrid,
  Copy,
  ShieldAlert,
  Menu,
  X,
  Languages,
  HelpCircle,
  Quote
} from "lucide-react";

// --- CONFIG & UTILS ---

// NOTE: In a real app, these would be in .env. Using placeholders as requested.
const SUPABASE_URL = "https://xyzcompany.supabase.co";
const SUPABASE_KEY = "public-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const THEME = {
  bg: "#0a1628",
  burgundy: "#8B1538",
  gold: "#00A8E8", // Cyan/Gold accent
};

// --- INTERNATIONALIZATION (I18n) ---

const CONTENT = {
  ar: {
    heroTitle: "صناعة فيديوهات AI احترافية",
    heroSubtitle: "أتقن أدوات الذكاء الاصطناعي لإنتاج محتوى عالمي في 4 أسابيع.",
    ctaStart: "ابدأ التعلم الآن",
    ctaTools: "استكشف الأدوات",
    priceTag: "35 يورو",
    lifetime: "وصول مدى الحياة",
    guarantee: "ضمان استرجاع الأموال لمدة 7 أيام",
    curriculum: "المنهج الدراسي",
    modules: [
      { title: "الأساسيات والنظرية", desc: "فهم أساسيات الذكاء الاصطناعي للفيديو" },
      { title: "التطبيق العملي", desc: "مشاريع عملية باستخدام Midjourney و ChatGPT" },
      { title: "الاحتراف والإنتاج", desc: "إنتاج محتوى احترافي والحصول على الشهادة" },
    ],
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    accessCode: "كود الدخول",
    dashboard: "لوحة التحكم",
    tools: "الأدوات",
    prompts: "المكتبة",
    register: "التسجيل",
    locked: "محتوى محمي",
    copy: "نسخ",
    copied: "تم النسخ!",
    toolsList: [
      { name: "ChatGPT", role: "كتابة السيناريو" },
      { name: "Midjourney", role: "توليد الصور" },
      { name: "ElevenLabs", role: "التعليق الصوتي" },
      { name: "CapCut", role: "المونتاج والتحرير" }
    ],
    faqTitle: "الأسئلة الشائعة",
    faqs: [
      { q: "هل الدورة مناسبة للمبتدئين؟", a: "نعم، نبدأ من الصفر ولا تحتاج لخبرة مسبقة في المونتاج أو الذكاء الاصطناعي." },
      { q: "هل أحتاج لجهاز كمبيوتر قوي؟", a: "لا، معظم أدوات الذكاء الاصطناعي تعمل على السحابة (Cloud) ولا تتطلب مواصفات عالية." },
      { q: "كيف أحصل على الدعم؟", a: "لدينا مجتمع خاص للطلاب ودعم مباشر خلال الجلسات الحية للإجابة على جميع استفساراتكم." },
      { q: "هل البرامج مشمولة في السعر؟", a: "سعر الدورة يغطي التعليم. الأدوات (مثل Midjourney) تتطلب اشتراكات منفصلة، لكننا نعلمك كيفية استخدام البدائل المجانية أيضاً." }
    ],
    testimonialsTitle: "قصص نجاح",
    testimonials: [
      { name: "أحمد س.", role: "صانع محتوى", text: "هذه الدورة غيرت طريقة عملي بالكامل. وفرت مئات الساعات وزادت جودة إنتاجي بشكل ملحوظ." },
      { name: "سارة م.", role: "مسوقة رقمية", text: "أفضل استثمار قمت به. المعلومات مكثفة وعملية جداً، وبدأت بتطبيقها من الأسبوع الأول." }
    ]
  },
  fr: {
    heroTitle: "Création Vidéo AI Professionnelle",
    heroSubtitle: "Maîtrisez les outils d'IA pour produire du contenu de classe mondiale en 4 semaines.",
    ctaStart: "Commencer Maintenant",
    ctaTools: "Explorer les Outils",
    priceTag: "35 EURO",
    lifetime: "Accès à Vie",
    guarantee: "Garantie satisfait ou remboursé de 7 jours",
    curriculum: "Programme du Cours",
    modules: [
      { title: "Théorie & Bases", desc: "Comprendre les bases de l'IA pour la vidéo" },
      { title: "Pratique", desc: "Projets pratiques avec Midjourney & ChatGPT" },
      { title: "Maîtrise", desc: "Production de contenu pro & Certification" },
    ],
    login: "Connexion",
    email: "Email",
    accessCode: "Code d'accès",
    dashboard: "Tableau de bord",
    tools: "Outils",
    prompts: "Prompts",
    register: "Inscription",
    locked: "Contenu Protégé",
    copy: "Copier",
    copied: "Copié!",
    toolsList: [
      { name: "ChatGPT", role: "Scénario" },
      { name: "Midjourney", role: "Génération d'images" },
      { name: "ElevenLabs", role: "Voix Off" },
      { name: "CapCut", role: "Montage" }
    ],
    faqTitle: "Questions Fréquentes",
    faqs: [
      { q: "Est-ce adapté aux débutants ?", a: "Oui, nous commençons de zéro sans aucun prérequis technique." },
      { q: "Ai-je besoin d'un PC puissant ?", a: "Non, la plupart des outils IA sont basés sur le cloud et fonctionnent sur n'importe quel navigateur." },
      { q: "Comment obtenir de l'aide ?", a: "Nous avons une communauté privée et un support en direct pendant les sessions interactives." },
      { q: "Les logiciels sont-ils inclus ?", a: "Le prix couvre la formation. Certains outils nécessitent un abonnement, mais nous montrons aussi des alternatives gratuites." }
    ],
    testimonialsTitle: "Témoignages",
    testimonials: [
      { name: "Ahmed S.", role: "Créateur de contenu", text: "Ce cours a transformé mon flux de travail. Un gain de temps incroyable et une qualité supérieure." },
      { name: "Sarah M.", role: "Marketeuse", text: "Le meilleur investissement de l'année. Contenu très pro et immédiatement applicable." }
    ]
  }
};

const LanguageContext = createContext<any>(null);

const LanguageProvider = ({ children }: { children?: React.ReactNode }) => {
  const [lang, setLang] = useState<'ar' | 'fr'>('ar');

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'fr' : 'ar');
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: CONTENT[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLang = () => useContext(LanguageContext);

// --- COMPONENTS ---

const FloatingIcon = ({ icon: Icon, delay, x, y }: { icon: any, delay: number, x: number, y: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
    className="absolute text-primary opacity-30 pointer-events-none z-0"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Icon size={64} />
  </motion.div>
);

const Navbar = () => {
  const { lang, t, toggleLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' }, // Assuming localized labels needed, but for simplicity keeping hardcoded or using 't' if mapped
    { path: '/tools', label: t.tools },
    { path: '/prompts', label: t.prompts },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 rounded-b-2xl mx-4 mt-4 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-white">
        Frekholito
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 space-x-reverse">
        {navLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-gray-300'}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleLang} className="flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition">
          <Globe size={16} />
          {lang.toUpperCase()}
        </button>
        <Link to="/login" className="hidden md:block bg-primary hover:bg-sky-400 text-black px-5 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(0,168,232,0.4)]">
          {t.login}
        </Link>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 glass-panel rounded-xl flex flex-col gap-4 md:hidden"
        >
           {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block py-2 text-center text-gray-300">
              {link.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-center text-primary font-bold">
            {t.login}
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="py-10 text-center text-gray-500 text-sm border-t border-white/5 mt-20">
    <p>&copy; 2024 Frekholito. All rights reserved.</p>
  </footer>
);

// --- PAGES ---

const HeroSection = () => {
  const { t, lang } = useLang();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* 3D Floating Elements Background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingIcon icon={Bot} delay={0} x={10} y={20} />
        <FloatingIcon icon={Sparkles} delay={1.5} x={80} y={15} />
        <FloatingIcon icon={Video} delay={0.5} x={70} y={70} />
        <FloatingIcon icon={Mic} delay={2} x={20} y={60} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6 backdrop-blur-sm">
            AI Video Mastery Course
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 pb-2">
            {t.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.heroSubtitle}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="group relative px-8 py-4 bg-primary text-black font-bold rounded-full text-lg overflow-hidden shadow-[0_0_20px_rgba(0,168,232,0.4)] hover:shadow-[0_0_40px_rgba(0,168,232,0.6)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t.ctaStart} <ArrowRight className={`transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </span>
            </Link>
            <Link 
              to="/tools" 
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-lg font-medium backdrop-blur-md transition-all"
            >
              {t.ctaTools}
            </Link>
          </div>
        </motion.div>

        {/* Tools Taught Ticker */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {t.toolsList.map((tool: any) => (
             <div key={tool.name} className="flex items-center gap-2 text-sm font-semibold border border-white/10 px-4 py-2 rounded-lg bg-black/20">
                <Sparkles size={14} className="text-primary" /> {tool.name}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const CurriculumSection = () => {
  const { t, lang } = useLang();
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">{t.curriculum}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {t.modules.map((mod: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-8 rounded-2xl relative group hover:border-primary/50 transition-colors"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-secondary/50">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mt-6 mb-3 text-center text-primary">{mod.title}</h3>
              <p className="text-gray-400 text-center">{mod.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const { t } = useLang();
  return (
    <section className="py-24 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">{t.testimonialsTitle}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {t.testimonials.map((test: any, i: number) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="glass-panel p-8 rounded-2xl border-l-4 border-primary"
             >
                <Quote className="text-primary mb-4 opacity-50" size={32} />
                <p className="text-lg text-gray-200 italic mb-6 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{test.name}</h4>
                    <p className="text-xs text-gray-400">{test.role}</p>
                  </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const { t } = useLang();
  return (
    <section className="py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <HelpCircle className="text-primary" /> {t.faqTitle}
            </h2>
            <div className="grid gap-6">
                {t.faqs.map((f: any, i: number) => (
                    <motion.div 
                      key={i} 
                      className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                        <h3 className="font-bold text-lg mb-3 text-primary">{f.q}</h3>
                        <p className="text-gray-300 leading-relaxed">{f.a}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  )
}

const PricingSection = () => {
  const { t } = useLang();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-6 flex justify-center">
        <motion.div 
          className="relative max-w-md w-full glass-panel rounded-3xl p-1 bg-gradient-to-b from-white/20 to-transparent"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bg-[#0f1c30] rounded-[22px] p-8 md:p-12 text-center h-full relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={120} />
             </div>
             <h3 className="text-primary font-bold uppercase tracking-wider mb-2">Lifetime Access</h3>
             <div className="text-6xl font-black text-white mb-2 text-glow">{t.priceTag}</div>
             <p className="text-gray-400 mb-8">One-time payment. No hidden fees.</p>
             
             <ul className="text-left space-y-4 mb-10 text-gray-300">
               <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" size={20} /> 12 Live Interactive Sessions</li>
               <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" size={20} /> 4 Weeks Duration</li>
               <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" size={20} /> {t.guarantee}</li>
               <li className="flex items-center gap-3"><CheckCircle2 className="text-green-400" size={20} /> Certification Included</li>
             </ul>

             <Link to="/register" className="block w-full py-4 bg-gradient-to-r from-secondary to-pink-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all">
               {t.ctaStart}
             </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- AUTH & PROTECTED ROUTES ---

const LoginPage = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate Supabase/Backend check
    // In a real app: await supabase.from('course_users').select('*').eq('email', email).eq('access_code', code).single();
    
    setTimeout(() => {
      // Mock validation for demo
      if (email && code.length > 3) {
        localStorage.setItem("frekholito_user", JSON.stringify({ email }));
        navigate("/dashboard");
      } else {
        setError("Invalid credentials (try any email + 4 digit code)");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">{t.login}</h2>
          {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">{t.email}</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">{t.accessCode}</label>
              <input 
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-sky-400 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t.login}
            </button>
          </form>
        </motion.div>
    </div>
  );
};

const RegistrationWizard = () => {
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', experience: '', goals: '', device: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(s => s + 1);
  
  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, post to Formspree here
    const form = e.target as HTMLFormElement;
    form.action = "https://formspree.io/f/xwvvpydv";
    form.submit();
  };

  return (
    <div className="min-h-screen pt-24 px-6 flex justify-center">
      <motion.div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 flex-1 mx-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-700'}`} />
          ))}
        </div>
        
        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={submitForm} method="POST">
            {step === 1 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6">Personal Info</h2>
                <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3" required />
                <input name="phone" placeholder="WhatsApp Number" onChange={handleChange} className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3" required />
                <button type="button" onClick={nextStep} className="bg-primary text-black px-6 py-2 rounded-lg font-bold">Next</button>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6">Experience</h2>
                <select name="experience" onChange={handleChange} className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3 text-gray-300">
                   <option>Beginner</option>
                   <option>Intermediate</option>
                   <option>Pro</option>
                </select>
                <textarea name="goals" placeholder="What are your goals?" onChange={handleChange} className="w-full mb-4 bg-black/30 border border-white/10 rounded-xl p-3" />
                <button type="button" onClick={nextStep} className="bg-primary text-black px-6 py-2 rounded-lg font-bold">Next</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6">Confirm</h2>
                <p className="mb-4 text-gray-400">Ready to join the AI revolution? Click submit to finalize your pre-registration.</p>
                <input type="hidden" name="details" value={JSON.stringify(formData)} />
                <button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">Complete Registration</button>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [user, setUser] = useState<{email: string} | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("frekholito_user");
    if (!stored) {
      navigate("/login");
    } else {
      setUser(JSON.parse(stored));
    }

    // Anti-Piracy Logic
    const handleVisibilityChange = () => {
      if (document.hidden) setIsBlurred(true);
      else setIsBlurred(false);
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    
    // Disable print screen shortcut logic (limited browser support, but good practice)
    const handleKey = (e: KeyboardEvent) => {
       if (e.key === "PrintScreen") {
          alert("Screenshots are disabled for copyright protection.");
          setIsBlurred(true);
          setTimeout(() => setIsBlurred(false), 2000);
       }
    };
    window.addEventListener("keyup", handleKey);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keyup", handleKey);
    };
  }, [navigate]);

  if (!user) return null;

  return (
    <div className={`min-h-screen pt-24 px-6 transition-all duration-300 ${isBlurred ? 'blur-2xl' : ''}`}>
       <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t.dashboard}</h1>
            <button onClick={() => { localStorage.removeItem("frekholito_user"); navigate("/"); }} className="text-red-400 text-sm">Logout</button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             {/* Main Video Player */}
             <div className="md:col-span-2 space-y-6">
               <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-16 h-16 text-white/50 group-hover:text-primary transition-colors cursor-pointer" />
                  </div>
                  {/* Watermark Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-20">
                     <motion.div 
                        animate={{ x: [0, 200, 0, -200, 0], y: [0, 150, 0, -150, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 text-white/20 font-bold text-xl whitespace-nowrap rotate-12"
                     >
                       {user.email} - IP: 192.168.x.x
                     </motion.div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full">
                    <div className="w-1/3 h-full bg-primary rounded-full" />
                  </div>
               </div>
               
               <div className="glass-panel p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-2">Session 1: Introduction to AI Tools</h2>
                  <p className="text-gray-400">In this session, we set up Midjourney, ChatGPT, and ElevenLabs accounts.</p>
               </div>
             </div>

             {/* Sidebar Playlist */}
             <div className="space-y-4">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors ${i === 1 ? 'bg-primary/10 border border-primary/30' : 'bg-black/20'}`}>
                     <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">{i}</div>
                     <div className="flex-1">
                        <div className="font-medium text-sm">Course Module {i}</div>
                        <div className="text-xs text-gray-500">24:00 min</div>
                     </div>
                     {i > 1 && <Lock size={14} className="text-gray-600" />}
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

const ToolsPage = () => {
    const tools = [
        { name: "Midjourney", cat: "Image", desc: "Best for artistic generation", color: "from-purple-500 to-indigo-500" },
        { name: "ChatGPT", cat: "Text", desc: "Scripting & Brainstorming", color: "from-green-400 to-emerald-600" },
        { name: "ElevenLabs", cat: "Audio", desc: "Ultra-realistic Voiceover", color: "from-gray-700 to-gray-900" },
        { name: "CapCut", cat: "Video", desc: "Editing powerhouse", color: "from-black to-gray-800" },
        { name: "RunwayML", cat: "Video", desc: "Text to Video AI", color: "from-pink-500 to-rose-500" },
        { name: "Leonardo.ai", cat: "Image", desc: "Free alternative to MJ", color: "from-blue-500 to-cyan-500" },
    ];

    return (
        <div className="min-h-screen pt-24 px-6 container mx-auto">
            <h1 className="text-4xl font-bold mb-8">AI Toolkit</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((t, i) => (
                    <motion.a 
                        href="#"
                        key={i}
                        whileHover={{ y: -5 }}
                        className="block glass-panel p-1 rounded-2xl overflow-hidden"
                    >
                        <div className={`h-32 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                            <Bot className="text-white w-12 h-12 opacity-80" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-xl">{t.name}</h3>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{t.cat}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{t.desc}</p>
                            <div className="flex items-center text-primary text-sm font-bold">
                                Launch Tool <ArrowRight size={14} className="ml-1" />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
};

const PromptsPage = () => {
    const { t } = useLang();
    const prompts = [
        "Hyper-realistic portrait of a cyberpunk warrior, neon lights, 8k resolution --ar 16:9",
        "Explain quantum physics to a 5-year-old in a storytelling format.",
        "Cinematic shot of a futuristic city in Mars, dust storms, red atmosphere, volumetric lighting",
        "Write a 60-second YouTube Short script about 'Productivity Hacks' with a hook."
    ];
    
    const [copied, setCopied] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        // Sound effect would go here: new Audio('/click.mp3').play();
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen pt-24 px-6 container mx-auto">
            <h1 className="text-4xl font-bold mb-8">{t.prompts} Library</h1>
            <div className="grid gap-4">
                {prompts.map((p, i) => (
                    <div key={i} className="glass-panel p-6 rounded-xl flex justify-between items-center gap-4 group hover:border-primary/40 transition-colors">
                        <code className="text-sm md:text-base text-gray-300 font-mono bg-black/30 p-2 rounded flex-1">
                            {p}
                        </code>
                        <button 
                            onClick={() => handleCopy(p, i)}
                            className="bg-white/5 hover:bg-primary hover:text-black p-3 rounded-lg transition-all"
                        >
                            {copied === i ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- APP ROUTER ---

const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-black">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <CurriculumSection />
                <TestimonialsSection />
                <FAQSection />
                <PricingSection />
                <Footer />
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationWizard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
          </Routes>
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);