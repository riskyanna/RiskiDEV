import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function MobileApp() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState([])
  const [pricingPackages, setPricingPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Fetch Data
    const fetchData = async () => {
       try {
          const items = await api.getPortfolio('app')
          if(items) setPortfolioItems(items)
          
          const prices = await api.getPricing('app')
          if(prices) setPricingPackages(prices)
       } catch (e) {
          console.error("Failed to fetch app data", e)
       } finally {
          setLoading(false)
       }
    }
    fetchData()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  const formatPrice = (price) => {
    return Number(price).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Navigation */}
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isMobileMenuOpen ? 'bg-white shadow-lg py-3' : (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5')
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 relative z-50">
                    <div className="bg-indigo-600 px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-200">
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            RISKI <span className="font-extrabold">APP</span>
                        </h2>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden relative z-50 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="/" className="text-gray-600 hover:text-indigo-600 font-bold transition-colors text-sm">
                        ← Kembali ke Web
                    </a>
                    {portfolioItems.length > 0 && (
                        <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-sm">
                            Portfolio
                        </a>
                    )}
                    <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors text-sm">
                        Harga
                    </a>
                    <a 
                        href="https://wa.me/62895396836264?text=Halo,%20saya%20tertarik%20jasa%20pembuatan%20aplikasi%20mobile"
                        target="_blank"
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 text-sm shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                    >
                        Konsultasi App
                    </a>
                </div>
            </div>
        </div>

      </nav>

      {/* Mobile Menu Drawer - Moved outside Nav to ensure proper stacking */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-28 px-6 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           <div className="flex flex-col space-y-6 h-full overflow-y-auto pb-10">
               <a href="/" className="flex items-center gap-3 text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                  <span>🔙</span> Kembali ke Website Utama
               </a>
               
               {portfolioItems.length > 0 && (
                  <a 
                    href="#portfolio" 
                    onClick={(e) => {
                      scrollToSection(e, 'portfolio')
                      setIsMobileMenuOpen(false)
                    }} 
                    className="text-lg font-medium text-gray-600 hover:text-indigo-600"
                  >
                      Portfolio
                  </a>
               )}
               
               <a 
                  href="#pricing" 
                  onClick={(e) => {
                      scrollToSection(e, 'pricing')
                      setIsMobileMenuOpen(false)
                  }} 
                  className="text-lg font-medium text-gray-600 hover:text-indigo-600"
               >
                  Pilihan Paket Harga
               </a>

               <a 
                      href="https://wa.me/62895396836264?text=Halo,%20saya%20tertarik%20jasa%20pembuatan%20aplikasi%20mobile"
                      target="_blank"
                      className="bg-indigo-600 text-white px-5 py-4 rounded-xl font-bold text-center shadow-lg shadow-indigo-200 mt-4"
                  >
                      Konsultasi via WhatsApp
                  </a>
           </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="animate-fadeInLeft">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-6 border border-indigo-200 shadow-sm">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                        Jasa Pembuatan Aplikasi Android & iOS
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        Ubah Ide Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Aplikasi Mobile</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                        Kami membantu Anda mewujudkan aplikasi mobile impian dengan teknologi modern (Flutter/React Native). Responsif, Cepat, dan Siap Publish.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                            href="https://wa.me/62895396836264?text=Halo,%20saya%20ingin%20konsultasi%20pembuatan%20aplikasi" 
                            target="_blank"
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 hover:shadow-indigo-300"
                        >
                            Mulai Project Sekarang
                        </a>
                        <a 
                             href="#pricing"
                             onClick={(e) => scrollToSection(e, 'pricing')}
                             className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-bold text-center hover:bg-gray-50 transition-all hover:border-indigo-200 hover:text-indigo-600"
                        >
                            Lihat Paket Harga
                        </a>
                    </div>
                </div>

                {/* Hero Realistic Mockup Area */}
                <div className="relative lg:h-[600px] flex items-center justify-center perspective-1000 animate-fadeInRight mt-10 lg:mt-0">
                    
                    {/* Laptop Mockup (Behind) */}
                    <div className="relative w-[600px] hidden md:block transform -translate-x-12 translate-y-4 z-0 group">
                        {/* Lid */}
                        <div className="bg-[#0d0d0d] rounded-t-2xl p-3 pb-8 relative border-4 border-[#1a1a1a] shadow-2xl transition-transform duration-500 ease-out group-hover:rotate-x-2 perspective-1000">
                             {/* Camera & Bezel Details */}
                             <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#1a1a1a] rounded-full z-20 flex items-center justify-center">
                                <div className="w-0.5 h-0.5 bg-[#333] rounded-full"></div>
                                {/* IR Blaster glimmer */}
                                <div className="absolute -right-2 w-0.5 h-0.5 bg-[#222] rounded-full opacity-50"></div>
                             </div>
                             
                             {/* Screen */}
                             <div className="bg-black rounded-lg overflow-hidden h-[340px] w-full relative border border-[#000]">
                                 {/* Fake Browser UI (Dark Mode) */}
                                 <div className="bg-[#1e1e1e] h-7 flex items-center gap-2 px-4 border-b border-[#333]">
                                     <div className="flex gap-1.5">
                                         <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                                         <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                                     </div>
                                     <div className="flex-1 bg-[#2a2a2a] h-5 rounded-md mx-4 flex items-center px-3">
                                         <div className="text-[8px] text-gray-500">cendekia.academy</div>
                                     </div>
                                 </div>
                                 
                                 {/* ACTUAL IAMGE CONTENT */}
                                 <div className="relative h-full w-full bg-white overflow-hidden scrollbar-hide">
                                     <img 
                                        src="/hero-preview.png" 
                                        alt="Website Preview" 
                                        className="w-full h-auto object-cover object-top"
                                     />
                                     {/* Screen Gloss/Reflection Overlay */}
                                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-5 pointer-events-none"></div>
                                     <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none"></div>
                                 </div>
                             </div>
                        </div>
                        {/* Base */}
                        <div className="bg-[#d2d2d7] h-4 rounded-b-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative border-t border-[#888]">
                             {/* Trackpad Notch */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#a1a1a6] rounded-b-md"></div>
                        </div>
                    </div>

                    {/* Phone Mockup (Front) */}
                    <div className="relative w-[280px] h-[550px] bg-black rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] z-10 transform rotate-y-12 translate-x-12 border-[12px] border-[#1a1a1a] ring-1 ring-white/10">
                        {/* Buttons (Side) */}
                        <div className="absolute top-32 -left-4 w-1 h-10 bg-[#1a1a1a] rounded-l-md border-l border-[#333]"></div>
                        <div className="absolute top-48 -left-4 w-1 h-16 bg-[#1a1a1a] rounded-l-md border-l border-[#333]"></div>
                        <div className="absolute top-40 -right-4 w-1 h-20 bg-[#1a1a1a] rounded-r-md border-r border-[#333]"></div>

                        {/* Dynamic Island / Notch */}
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 h-8 w-28 bg-black rounded-full z-30 flex justify-center items-center gap-2 shadow-sm">
                             <div className="w-16 h-4 bg-[#111] rounded-full flex items-center justify-end px-2">
                                <div className="w-2 h-2 rounded-full bg-[#222]"></div>
                             </div>
                        </div>
                        
                        {/* Screen Content */}
                        <div className="w-full h-full bg-white rounded-[2.8rem] overflow-hidden relative">
                           {/* Mobile App UI */}
                           <div className="bg-white h-full w-full overflow-hidden flex flex-col relative">
                               {/* Status Bar */}
                               <div className="h-12 w-full bg-transparent absolute top-0 z-20 flex justify-between px-6 pt-3 text-[10px] font-bold text-white">
                                   <span>9:41</span>
                                   <div className="flex gap-1">
                                       <span>📶</span>
                                       <span>🔋</span>
                                   </div>
                               </div>

                               {/* Header Mockup */}
                               <div className="bg-gradient-to-br from-orange-400 to-amber-600 h-44 rounded-b-[2.5rem] p-6 pt-16 text-white shadow-xl relative overflow-hidden">
                                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                                   <div className="flex justify-between items-center mb-6">
                                      <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">☰</div>
                                      <div className="w-10 h-10 rounded-full bg-white/90 border-2 border-white/50 shadow-inner bg-[url('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')] bg-cover"></div>
                                   </div>
                                   <h4 className="font-bold text-2xl leading-none">Hello,<br/><span className="opacity-90 font-normal">Siswa Cendekia!</span></h4>
                               </div>

                               {/* App Content */}
                               <div className="p-6 space-y-6">
                                   <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                       <div className="w-24 h-28 bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                           <div className="w-10 h-10 bg-indigo-100 rounded-full text-indigo-600 flex items-center justify-center font-bold text-xl">📚</div>
                                           <span className="text-xs font-bold text-gray-600">Jadwal</span>
                                       </div>
                                       <div className="w-24 h-28 bg-gradient-to-b from-green-50 to-white border border-green-100 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                           <div className="w-10 h-10 bg-green-100 rounded-full text-green-600 flex items-center justify-center font-bold text-xl">✅</div>
                                           <span className="text-xs font-bold text-gray-600">Hadir</span>
                                       </div>
                                       <div className="w-24 h-28 bg-gradient-to-b from-orange-50 to-white border border-orange-100 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                           <div className="w-10 h-10 bg-orange-100 rounded-full text-orange-600 flex items-center justify-center font-bold text-xl">🏆</div>
                                           <span className="text-xs font-bold text-gray-600">Nilai</span>
                                       </div>
                                   </div>

                                   {/* List Card */}
                                   <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4 items-center">
                                       <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">M</div>
                                       <div className="flex-1">
                                           <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">Sedang Berlangsung</div>
                                           <div className="font-bold text-gray-900 text-lg">Matematika</div>
                                           <div className="text-xs text-gray-400">R. 102 • Pak Budi</div>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           
                           {/* Screen Reflection */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none rounded-[2.8rem]"></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Fitur Aplikasi Mobile</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Standar pengembangan tinggi untuk hasil yang maksimal.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: '🎨', title: 'UI/UX Premium', desc: 'Desain modern standar aplikasi startup unicorn.' },
                    { icon: '⚡', title: 'Performa Tinggi', desc: 'Aplikasi ringan dan cepat di berbagai tipe HP.' },
                    { icon: '🔒', title: 'Keamanan Data', desc: 'Proteksi data pengguna dengan enkripsi standar.' },
                    { icon: '🔄', title: 'Realtime Update', desc: 'Fitur notifikasi dan update konten secara langsung.' },
                    { icon: '📊', title: 'Admin Dashboard', desc: 'Web admin untuk kelola user dan konten aplikasi.' },
                    { icon: '📱', title: 'Play Store Ready', desc: 'Bantuan upload ke Google Play Store & App Store.' },
                ].map((item, idx) => (
                    <div key={idx} className="p-8 border border-gray-100 rounded-2xl bg-white hover:bg-gray-50 transition-all hover:-translate-y-1 group hover:border-indigo-100 hover:shadow-xl">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-600 group-hover:text-white">{item.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Portfolio Section - DYNAMIC */}
      {portfolioItems.length > 0 && (
          <section id="portfolio" className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Our Works</span>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Portfolio Aplikasi</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Beberapa aplikasi yang telah kami kerjakan.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((item) => (
                        <div key={item.id} className="group rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300">
                             <div className="relative h-64 overflow-hidden bg-gray-200">
                                 {item.image_url ? (
                                    <img 
                                      src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:3000/uploads/${item.image_url}`} 
                                      alt={item.title} 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl">📱</div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                                 <div className="absolute bottom-4 left-4">
                                     <span className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full">{item.category}</span>
                                 </div>
                             </div>
                             <div className="p-6">
                                 <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                 <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.description}</p>
                                 {item.project_url && (
                                     <a href={item.project_url} target="_blank" className="text-indigo-600 font-bold text-sm hover:underline">Lihat Demo ↗</a>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* Pricing Section - DYNAMIC */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Pricing</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Pilihan Paket App</h2>
                <p className="text-gray-600">Investasi terbaik untuk digitalisasi bisnis atau skripsi Anda.</p>
            </div>
            
            {pricingPackages.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {pricingPackages.map((pkg) => (
                        <div key={pkg.id} className={`bg-white rounded-3xl p-8 border hover:shadow-xl transition-all relative overflow-hidden flex flex-col ${pkg.is_best_seller ? 'border-indigo-600 shadow-xl scale-105 z-10' : 'border-gray-100 shadow-sm'}`}>
                            {pkg.is_best_seller && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-xl text-xs font-bold">POPULAR</div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                            <p className="text-sm text-gray-500 mb-6 mt-2 min-h-[40px]">{pkg.description}</p>
                            
                            <div className="mb-6">
                                <p className="text-4xl font-extrabold text-indigo-600">
                                    Rp{formatPrice(pkg.price_min)}
                                    {pkg.price_max && <span className="text-lg text-gray-400 font-normal"> - {formatPrice(pkg.price_max)}</span>}
                                </p>
                            </div>

                            <ul className="space-y-4 text-sm text-gray-600 mb-8 flex-1">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex gap-3 items-start">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs flex-shrink-0">✓</div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <a 
                                href={`https://wa.me/62895396836264?text=${pkg.whatsapp_message || 'Halo, saya tertarik dengan paket ' + pkg.name}`}
                                target="_blank"
                                className={`block w-full py-3.5 rounded-xl font-bold text-center transition-all transform hover:-translate-y-1 ${pkg.is_best_seller ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' : 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'}`}
                            >
                                Pilih Paket Ini
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Belum ada paket yang ditampilkan.</p>
                    <a href="/" className="text-indigo-600 font-bold hover:underline">Hubungi Admin</a>
                </div>
            )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
             <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px]"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Siap Membuat Aplikasi Mobile Anda?</h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">Jangan biarkan ide cemerlang Anda hanya jadi angan-angan. Konsultasikan kebutuhan Anda sekarang, Gratis.</p>
              <a href="https://wa.me/62895396836264" className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl">
                  Chat WhatsApp Sekarang ➜
              </a>
          </div>
      </section>
    </div>
  )
}
