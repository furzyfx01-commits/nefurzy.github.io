import { motion, AnimatePresence } from "framer-motion";
import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ExternalLink, MessageSquare, Plus, Trash2, Upload, Link as LinkIcon, X, Settings } from "lucide-react";

interface Product {
  id: number;
  title: string;
  image: string;
  description: string;
}

export default function ServiceDetail() {
  const [, params] = useRoute("/service/:id");
  const serviceId = params?.id;
  const [service, setService] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [studioName, setStudioName] = useState("DES STUDIO");
  const [studioLogo, setStudioLogo] = useState("");
  const [discordLink, setDiscordLink] = useState("https://discord.gg/BRTjgZZKge");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: "", image: "", description: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const savedServices = localStorage.getItem("admin_services");
    const savedSettings = localStorage.getItem("admin_settings");
    const savedProducts = localStorage.getItem(`service_products_${serviceId}`);
    
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setStudioName(settings.studioName || "DES STUDIO");
      setStudioLogo(convertDriveLink(settings.studioLogo) || "");
      setDiscordLink(settings.discordLink || "https://discord.gg/BRTjgZZKge");
    }

    if (savedServices && serviceId) {
      const allServices = JSON.parse(savedServices);
      const found = allServices.find((s: any) => s.id.toString() === serviceId);
      if (found) {
        setService({
          ...found,
          image: convertDriveLink(found.image)
        });
        
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        } else {
          setProducts([
            { id: 1, title: `${found.title} Concept #1`, image: found.image || "", description: "Thiết kế cao cấp, tinh tế và đầy tính nghệ thuật." },
            { id: 2, title: `${found.title} Concept #2`, image: found.image || "", description: "Phối màu futuristic, mang đậm chất tương lai." },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [serviceId]);

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem(`service_products_${serviceId}`, JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      image: convertDriveLink(newProduct.image)
    };
    const updated = [...products, productToAdd];
    saveProducts(updated);
    setNewProduct({ title: "", image: "", description: "" });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Xóa sản phẩm này?")) {
      const updated = products.filter(p => p.id !== id);
      saveProducts(updated);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!service) return <div className="min-h-screen bg-[hsl(220,40%,8%)] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden text-white font-sans bg-[hsl(220,40%,8%)]">
      <Navbar />
      
      {/* Header Space */}
      <div className="pt-32 pb-12 px-6">
        <div className="container mx-auto">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-colors mb-8 group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Quay lại trang chủ
            </button>
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">{service.title}</h1>
              <p className="text-xl text-blue-100/70 max-w-2xl italic">
                Khám phá những dự án tiêu biểu và phong cách thiết kế độc quyền của {studioName} dành riêng cho {service.title.toLowerCase()}.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-start lg:justify-end gap-4"
            >
              <button 
                onClick={() => setIsAdmin(!isAdmin)}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isAdmin ? 'bg-cyan-500 text-white' : 'glass text-white/70 hover:text-white'}`}
              >
                <Settings size={18} /> {isAdmin ? 'Thoát Admin' : 'Quản lý mục này'}
              </button>
              <a href={discordLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                <MessageSquare size={18} /> Liên hệ tư vấn
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="container mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2rem] glass border border-cyan-500/30">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400">Chế độ quản trị: {service.title}</h2>
                <p className="text-white/50">Thêm hoặc xóa các sản phẩm hiển thị trong danh mục này.</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold transition-all">
                <Plus size={20} /> Thêm sản phẩm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl overflow-hidden group border border-white/5 hover:border-cyan-500/30 transition-all relative"
              >
                {isAdmin && (
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                     <button className="w-full py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold flex items-center justify-center gap-2">
                       <ExternalLink size={14} /> Xem chi tiết
                     </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{product.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass w-full max-w-xl p-8 rounded-[2.5rem] border border-white/10 relative">
              <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={24} /></button>
              <h3 className="text-2xl font-bold mb-6">Thêm sản phẩm cho {service.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Tên sản phẩm</label>
                  <input type="text" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} placeholder="VD: Poster Cyberpunk #1" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Ảnh sản phẩm</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-cyan-500/50 transition-all">
                      <Upload size={18} /> Tải ảnh lên
                    </button>
                    <div className="relative">
                      <input type="text" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="Hoặc dán link ảnh..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all pl-10" />
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  {newProduct.image && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-white/10">
                      <img src={newProduct.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">Mô tả sản phẩm</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} placeholder="Mô tả ngắn về sản phẩm..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500/50 outline-none transition-all h-24 resize-none" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all">Hủy</button>
                  <button onClick={handleAddProduct} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-100 transition-all">Xác nhận thêm</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 text-center">
          {studioLogo && (
            <div className="flex justify-center mb-6">
              <img src={studioLogo} className="w-16 h-16 rounded-full object-cover border border-white/10" alt="Logo" />
            </div>
          )}
          <h2 className="text-3xl font-display font-bold mb-6">Bạn có ý tưởng cho dự án của mình?</h2>
          <p className="text-white/50 mb-10 max-w-xl mx-auto">Hãy để {studioName} giúp bạn hiện thực hóa tầm nhìn với phong cách thiết kế high-end và chuyên nghiệp nhất.</p>
          <a href={discordLink} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 rounded-full bg-white text-black font-bold hover:bg-cyan-400 hover:text-white transition-all transform hover:scale-105">
            Bắt đầu dự án ngay
          </a>
        </div>
      </footer>
    </div>
  );
}
