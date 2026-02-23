import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  Link as LinkIcon, 
  Settings, 
  LayoutDashboard, 
  Briefcase, 
  Image as ImageIcon,
  CheckCircle,
  X,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<"general" | "services" | "detail-management">("general");
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [detailProducts, setDetailProducts] = useState<Product[]>([]);
  
  const [studioName, setStudioName] = useState("Loz Phat");
  const [studioLogo, setStudioLogo] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [heroTitle, setHeroTitle] = useState("Loz Phat");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroBg, setHeroBg] = useState("");
  const [serviceTransitionText, setServiceTransitionText] = useState("DES");
  const [portfolioTransitionText, setPortfolioTransitionText] = useState("DES");
  const [serviceTransitionTitle, setServiceTransitionTitle] = useState("Core Services");
  const [portfolioTransitionTitle, setPortfolioTransitionTitle] = useState("Visual Identity");
  
  const [showStatus, setShowStatus] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      const savedProducts = localStorage.getItem(`service_products_${selectedServiceId}`);
      if (savedProducts) {
        setDetailProducts(JSON.parse(savedProducts));
      } else {
        setDetailProducts([]);
      }
    }
  }, [selectedServiceId]);

  const loadAllData = () => {
    const savedServices = localStorage.getItem("admin_services");
    const savedSettings = localStorage.getItem("admin_settings");

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setStudioName(settings.studioName || "Loz Phat");
      setStudioLogo(settings.studioLogo || "");
      setDiscordLink(settings.discordLink || "");
      setHeroTitle(settings.heroTitle || "Loz Phat");
      setHeroDescription(settings.heroDescription || "");
      setHeroBg(settings.heroBg || "");
      setServiceTransitionText(settings.serviceTransitionText || "DES");
      setPortfolioTransitionText(settings.portfolioTransitionText || "DES");
      setServiceTransitionTitle(settings.serviceTransitionTitle || "Core Services");
      setPortfolioTransitionTitle(settings.portfolioTransitionTitle || "Visual Identity");
    }
  };

  const showNotification = (msg: string) => {
    setStatusMsg(msg);
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 3000);
  };

  const convertDriveLink = (url: string) => {
    if (!url) return "";
    if (typeof url === "string" && url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
      }
    }
    return url;
  };

  const saveGeneralSettings = () => {
    const settings = { 
      studioName, 
      studioLogo: convertDriveLink(studioLogo),
      discordLink, 
      heroTitle, 
      heroDescription, 
      heroBg: convertDriveLink(heroBg), 
      serviceTransitionText, 
      portfolioTransitionText,
      serviceTransitionTitle,
      portfolioTransitionTitle
    };
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
    showNotification("Đã lưu cài đặt chung!");
  };

  const updateService = (id: number, field: keyof Service, value: string) => {
    const updated = services.map(s => s.id === id ? { ...s, [field]: value } : s);
    setServices(updated);
    // Auto-save to local state but wait for explicit save button for localStorage
  };

  const saveServices = () => {
    const servicesWithConvertedLinks = services.map(s => ({
      ...s,
      image: convertDriveLink(s.image)
    }));
    localStorage.setItem("admin_services", JSON.stringify(servicesWithConvertedLinks));
    // Force direct state update in addition to storage event
    setServices(servicesWithConvertedLinks);
    window.dispatchEvent(new Event('storage'));
    showNotification("Đã lưu danh sách dịch vụ!");
  };

  const addService = () => {
    const newService = {
      id: Date.now(),
      title: "Dịch vụ mới",
      description: "Mô tả dịch vụ mới...",
      image: ""
    };
    setServices([...services, newService]);
  };

  const deleteService = (id: number) => {
    if (confirm("Xóa dịch vụ này?")) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem("admin_services", JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const saveDetailProducts = () => {
    if (selectedServiceId) {
      const converted = detailProducts.map(p => ({
        ...p,
        image: convertDriveLink(p.image)
      }));
      localStorage.setItem(`service_products_${selectedServiceId}`, JSON.stringify(converted));
      setDetailProducts(converted);
      window.dispatchEvent(new Event('storage'));
      showNotification("Đã lưu danh sách sản phẩm chi tiết!");
    }
  };

  const addDetailProduct = () => {
    const newProd = {
      id: Date.now(),
      title: "Sản phẩm mới",
      image: "",
      description: "Mô tả sản phẩm..."
    };
    setDetailProducts([...detailProducts, newProd]);
  };

  const deleteDetailProduct = (id: number) => {
    setDetailProducts(detailProducts.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[hsl(220,40%,6%)] text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/10 p-6 flex flex-col fixed inset-y-0">
        <div className="flex items-center gap-3 mb-10">
          {studioLogo ? (
            <img src={studioLogo} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="Logo" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500" />
          )}
          <div>
            <div className="font-bold text-lg">{studioName}</div>
            <div className="text-xs text-cyan-400/80">CMS Admin</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'general' ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
          >
            <LayoutDashboard size={18} />
            <span className="font-medium">Cài đặt chung</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("services")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'services' ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
          >
            <Briefcase size={18} />
            <span className="font-medium">Core Services</span>
          </button>

          <button 
            onClick={() => setActiveTab("detail-management")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'detail-management' ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
          >
            <ImageIcon size={18} />
            <span className="font-medium">Chi tiết dịch vụ</span>
          </button>
        </nav>

        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white mt-6">
          <ArrowLeft size={18} />
          <span>Quay lại trang chủ</span>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold">Quản trị nội dung</h1>
            <p className="text-white/50">Tùy chỉnh mọi thành phần trên website mà không cần code.</p>
          </div>
          
          <AnimatePresence>
            {showStatus && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
              >
                <CheckCircle size={20} />
                <span className="font-bold">{statusMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-[2.5rem] border border-white/10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Settings className="text-cyan-400" /> Cấu hình Website
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Tên Studio</label>
                  <input value={studioName} onChange={e => setStudioName(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all font-display font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Link Logo Studio (Dán link ảnh)</label>
                  <input value={studioLogo} onChange={e => setStudioLogo(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Link Discord / Liên hệ</label>
                  <input value={discordLink} onChange={e => setDiscordLink(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Tiêu đề Hero</label>
                  <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Mô tả Hero</label>
                  <textarea value={heroDescription} onChange={e => setHeroDescription(e.target.value)} className="w-full h-32 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Link ảnh nền Hero (Bỏ trống để dùng mặc định)</label>
                  <input value={heroBg} onChange={e => setHeroBg(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Chữ chuyển cảnh Dịch vụ (Lớn)</label>
                <input value={serviceTransitionText} onChange={e => setServiceTransitionText(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Tiêu đề chuyển cảnh Dịch vụ (Nhỏ)</label>
                <input value={serviceTransitionTitle} onChange={e => setServiceTransitionTitle(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Chữ chuyển cảnh Portfolio (Lớn)</label>
                <input value={portfolioTransitionText} onChange={e => setPortfolioTransitionText(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2 uppercase tracking-widest">Tiêu đề chuyển cảnh Portfolio (Nhỏ)</label>
                <input value={portfolioTransitionTitle} onChange={e => setPortfolioTransitionTitle(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button onClick={saveGeneralSettings} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-3">
                <Save size={20} /> Lưu cài đặt chung
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3"><Briefcase className="text-cyan-400" /> Danh mục dịch vụ chính</h2>
              <button onClick={addService} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 font-bold transition-all shadow-lg shadow-cyan-500/20">
                <Plus size={20} /> Thêm dịch vụ
              </button>
            </div>

            <div className="grid gap-6">
              {services.map(service => (
                <div key={service.id} className="glass p-6 rounded-[2rem] border border-white/10 group hover:border-cyan-500/30 transition-all">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <div className="aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative">
                        <img src={service.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload size={24} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex justify-between items-start">
                        <input 
                          value={service.title} 
                          onChange={e => updateService(service.id, 'title', e.target.value)}
                          className="text-xl font-bold bg-transparent border-b border-transparent focus:border-cyan-500/50 outline-none px-0 py-1 w-full mr-4"
                        />
                        <button onClick={() => deleteService(service.id)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <textarea 
                        value={service.description} 
                        onChange={e => updateService(service.id, 'description', e.target.value)}
                        className="w-full bg-white/5 rounded-xl p-4 border border-white/5 focus:border-cyan-500/30 outline-none text-white/60 text-sm h-24 resize-none"
                      />
                      <div className="relative">
                        <input 
                          value={service.image} 
                          onChange={e => updateService(service.id, 'image', e.target.value)}
                          className="w-full bg-white/5 rounded-xl py-3 pl-12 pr-4 border border-white/5 focus:border-cyan-500/30 outline-none text-xs"
                          placeholder="Link ảnh đại diện dịch vụ..."
                        />
                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-8">
              <button onClick={saveServices} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-3">
                <Save size={20} /> Lưu thay đổi dịch vụ
              </button>
            </div>
          </div>
        )}

        {activeTab === 'detail-management' && (
          <div className="space-y-8">
            <div className="glass p-6 rounded-[2rem] border border-white/10">
              <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-widest">Chọn dịch vụ để cấu hình trang "Learn More"</label>
              <div className="flex flex-wrap gap-3">
                {services.map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedServiceId === s.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {selectedServiceId ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Quản lý sản phẩm trong mục {services.find(s => s.id === selectedServiceId)?.title}</h3>
                  <button onClick={addDetailProduct} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-all border border-white/10">
                    <Plus size={18} /> Thêm sản phẩm chi tiết
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {detailProducts.map(prod => (
                    <div key={prod.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-black/40 border border-white/10">
                        <img src={prod.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between">
                          <input 
                            value={prod.title} 
                            onChange={e => {
                              const updated = detailProducts.map(p => p.id === prod.id ? { ...p, title: e.target.value } : p);
                              setDetailProducts(updated);
                            }}
                            className="font-bold bg-transparent border-b border-transparent focus:border-cyan-500/50 outline-none w-full"
                          />
                          <button onClick={() => deleteDetailProduct(prod.id)} className="text-red-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <input 
                          value={prod.image} 
                          onChange={e => {
                            const updated = detailProducts.map(p => p.id === prod.id ? { ...p, image: e.target.value } : p);
                            setDetailProducts(updated);
                          }}
                          className="w-full bg-white/5 rounded-lg py-2 px-3 border border-white/5 outline-none text-[10px]"
                          placeholder="Link ảnh sản phẩm..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-8">
                  <button onClick={saveDetailProducts} className="px-10 py-4 rounded-2xl bg-cyan-500 font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-100 transition-all flex items-center gap-3">
                    <Save size={20} /> Lưu sản phẩm chi tiết
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 glass rounded-[2.5rem] flex flex-col items-center justify-center text-white/30 border border-dashed border-white/10">
                <ImageIcon size={48} className="mb-4 opacity-20" />
                <p>Vui lòng chọn một dịch vụ ở trên để quản lý nội dung chi tiết</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
