
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import fastworkLogo from '../assets/logo fastwork.webp'

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState([
    { title: 'Tugas Website Mata Kuliah', category: 'Mahasiswa', badge: 'HTML • CSS • JS' },
    { title: 'Website UKM / Himpunan', category: 'Organisasi Kampus', badge: 'Profil • Kegiatan • Tim' },
    { title: 'Landing Page Event Kampus', category: 'Event', badge: 'Landing • Form Pendaftaran' },
    { title: 'Portfolio Fresh Graduate', category: 'Personal Branding', badge: 'Project • Skill • CV' },
    { title: 'Company Profile Sederhana', category: 'UMKM / Startup', badge: 'Jasa • Tentang • Kontak' },
    { title: 'Portfolio Designer / Fotografer', category: 'Creative', badge: 'Gallery • Case Study' },
  ])
  const [pricingPackages, setPricingPackages] = useState([])

  useEffect(() => {
    fetchPortfolio()
    fetchPricing()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const data = await api.getPortfolio()
      if (data && data.length > 0) {
        setPortfolioItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
    }
  }

  const fetchPricing = async () => {
    try {
      const data = await api.getPricing()
      if (data && data.length > 0) {
        setPricingPackages(data)
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
    }
  }

  // Format harga jadi lebih ringkas (1.200.000 -> 1,2jt)
  const formatPrice = (price) => {
    if (price >= 1000000) {
      const juta = price / 1000000
      return `${juta % 1 === 0 ? juta : juta.toFixed(1).replace('.', ',')}jt`
    } else if (price >= 1000) {
      const ribu = price / 1000
      return `${ribu % 1 === 0 ? ribu : ribu.toFixed(0)}rb`
    }
    return price.toLocaleString('id-ID')
  }

  const handleOrderClick = async (type) => {
    try {
      await api.trackOrder(type)
    } catch (error) {
      console.error('Failed to track order:', error)
    }
    window.open('https://wa.me/62895396836264?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20website%20portfolio', '_blank')
  }

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
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-primary-600 px-3 py-1.5 rounded-lg">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    RISKI <span className="font-extrabold">DEV</span>
                  </h2>
                </div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                Beranda
              </a>
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                Layanan
              </a>
              <a href="#portfolio" onClick={(e) => scrollToSection(e, 'portfolio')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                Portfolio
              </a>
              <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-gray-700 hover:text-primary-600 font-medium transition-colors text-sm">
                Tentang
              </a>
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all duration-300 text-sm shadow-sm"
              >
                Kontak
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium" onClick={(e) => scrollToSection(e, 'home')}>
                Beranda
              </a>
              <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium" onClick={(e) => scrollToSection(e, 'services')}>
                Layanan
              </a>
              <a href="#portfolio" className="text-gray-700 hover:text-primary-600 font-medium" onClick={(e) => scrollToSection(e, 'portfolio')}>
                Portfolio
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 font-medium" onClick={(e) => scrollToSection(e, 'about')}>
                Tentang
              </a>
              <a 
                href="#contact" 
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium text-center"
                onClick={(e) => scrollToSection(e, 'contact')}
              >
                Kontak
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
            {/* Left: Text */}
            <div className="md:pr-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-primary-700 text-xs font-bold uppercase tracking-wide mb-6 border border-blue-100">
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                Specialis Laravel & MySQL
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                JASA PEMBUATAN <br className="hidden lg:block"/>
                <span className="text-gray-900">SISTEM WEB</span> <br/>
                <span className="text-primary-600">SEKOLAH & KANTOR</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed font-medium">
                Responsive & <span className="text-gray-900 font-bold border-b-2 border-primary-200">Terintegrasi Admin Panel</span>.
                <br className="hidden md:block"/> Siap digunakan sesuai kebutuhan Anda.
              </p>
              
              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 font-medium">Custom sesuai kebutuhan</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 font-medium">Admin Panel & Role User</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 font-medium">Responsive (Mobile & Desktop)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">✓</div>
                  <span className="text-gray-700 font-medium">Aman & Mudah Dikembangkan</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <button
                  onClick={() => handleOrderClick('Hero Section')}
                  className="group inline-flex items-center justify-center bg-[#25D366] text-white px-6 py-3.5 rounded-full font-bold text-base hover:bg-[#20bd5a] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <svg className="w-6 h-6 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Konsultasi Gratis
                </button>
                
                <a
                  href="https://fastwork.id/user/riskiramadhan?source=web_marketplace_profile-menu_profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#0056C6] text-white px-6 py-3.5 rounded-full font-bold text-base hover:bg-[#004bb1] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                >
                  <img src={fastworkLogo} alt="Fastwork" className="h-6 w-auto mr-2 rounded" />
                  Order di Fastwork
                </a>

                <a
                  href="#pricing"
                  onClick={(e) => scrollToSection(e, 'pricing')}
                  className="inline-flex items-center justify-center text-gray-600 px-6 py-3.5 rounded-full font-semibold text-base hover:text-primary-600 hover:bg-gray-50 transition-all duration-300"
                >
                  Lihat Paket
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </a>
              </div>
            </div>

            {/* Right: Visual Mockup */}
            <div className="relative transform lg:scale-105 lg:-translate-x-6 transition-transform duration-500">
              <div className="absolute -top-12 -right-8 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl" />

              {/* Laptop Frame */}
              <div className="relative mx-auto bg-gray-900 rounded-t-xl rounded-b-[2px] shadow-2xl border-4 border-gray-800 w-full max-w-[500px] aspect-[16/10]">
                {/* Screen Content */}
                <div className="h-full w-full bg-white rounded-t-lg overflow-hidden relative group">
                  {/* Browser Header */}
                  <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="ml-3 flex-1 h-3 bg-white rounded-md border border-gray-200" />
                  </div>
                  
                  {/* Dashboard Content Mockup */}
                  <div className="p-4 grid grid-cols-4 gap-4 h-[calc(100%-24px)] bg-slate-50 overflow-hidden">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-white h-full rounded-lg border border-gray-200 p-2 space-y-2">
                       <div className="h-6 w-full bg-primary-50 rounded mb-4" />
                       <div className="h-3 w-3/4 bg-gray-100 rounded" />
                       <div className="h-3 w-5/6 bg-gray-100 rounded" />
                       <div className="h-3 w-2/3 bg-gray-100 rounded" />
                    </div>
                    {/* Main Content */}
                    <div className="col-span-3 space-y-3">
                       <div className="flex justify-between">
                         <div className="h-6 w-1/3 bg-gray-200 rounded" />
                         <div className="h-6 w-6 bg-primary-600 rounded-full" />
                       </div>
                       
                       <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 bg-white rounded-lg border border-gray-200 p-2">
                             <div className="h-2 w-1/2 bg-gray-100 rounded mb-2" />
                             <div className="h-4 w-3/4 bg-primary-100 rounded" />
                          </div>
                          <div className="h-16 bg-white rounded-lg border border-gray-200 p-2">
                             <div className="h-2 w-1/2 bg-gray-100 rounded mb-2" />
                             <div className="h-4 w-3/4 bg-green-100 rounded" />
                          </div>
                          <div className="h-16 bg-white rounded-lg border border-gray-200 p-2">
                             <div className="h-2 w-1/2 bg-gray-100 rounded mb-2" />
                             <div className="h-4 w-3/4 bg-yellow-100 rounded" />
                          </div>
                       </div>

                       <div className="h-32 bg-white rounded-lg border border-gray-200 p-2">
                          <div className="h-3 w-1/4 bg-gray-100 rounded mb-3" />
                          <div className="space-y-2">
                             <div className="h-2 w-full bg-gray-50 rounded" />
                             <div className="h-2 w-full bg-gray-50 rounded" />
                             <div className="h-2 w-5/6 bg-gray-50 rounded" />
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="relative mx-auto bg-gray-800 w-full max-w-[560px] h-3 rounded-b-xl shadow-xl flex justify-center">
                 <div className="h-1 w-16 bg-gray-600 rounded-lg mt-0.5" />
              </div>

              {/* Phone Mockup (Floating) */}
              <div className="absolute -bottom-6 -right-2 md:-right-8 w-24 h-48 bg-gray-900 rounded-[2rem] border-[6px] border-gray-900 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
                 <div className="h-full w-full bg-white rounded-[1.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-12 bg-black rounded-b-xl z-20" />
                    
                    {/* Phone Content */}
                    <div className="pt-6 px-2 pb-2 h-full bg-gradient-to-br from-blue-50 to-white">
                       <div className="space-y-2">
                          <div className="h-20 rounded-xl bg-white shadow-sm border border-gray-100 p-1.5 flex flex-col justify-end">
                              <div className="h-1.5 w-1/2 bg-gray-100 rounded mb-1" />
                              <div className="h-4 w-3/4 bg-primary-100 rounded" />
                          </div>
                          <div className="h-20 rounded-xl bg-primary-600 shadow-md p-1.5 flex flex-col justify-end">
                              <div className="h-1.5 w-1/2 bg-white/30 rounded mb-1" />
                              <div className="h-4 w-3/4 bg-white/50 rounded" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Mobile App Promo Banner - Upgraded */}
      <div className="relative py-8 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 overflow-hidden">
         {/* Abstract Shapes */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl mix-blend-screen animate-blob"></div>
            <div className="absolute top-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl mix-blend-screen animate-blob animation-delay-2000"></div>
         </div>
         
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-1">
               <div className="flex items-center gap-4 text-center md:text-left">
                  <div className="hidden md:flex w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-3xl shadow-lg">
                    📱
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Butuh Aplikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Android & iOS?</span></h3>
                    <p className="text-indigo-200 text-sm">Tersedia paket khusus Mahasiswa & UMKM. Siap publish ke Play Store!</p>
                  </div>
               </div>
               
               <Link 
                 to="/mobile-app"
                 className="group relative inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-900/20"
               >
                 <span>Lihat Layanan App</span>
                 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                 </svg>
                 
                 {/* Shine Effect */}
                 <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
               </Link>
            </div>
         </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Layanan <span className="text-primary-600">Unggulan</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Solusi digital lengkap dengan standar industri, mulai dari tugas kuliah hingga website profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'UI/UX Modern', 
                desc: 'Tampilan website yang aesthetic, clean, dan profesional. Jauh dari kesan kaku atau "web jadul".' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Responsive Mobile', 
                desc: 'Tampilan otomatis menyesuaikan layar HP, Tablet, dan Laptop. Wajib untuk standar web tahun 2024.' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                ), 
                title: 'Admin Panel', 
                desc: 'Dashboard dinamis untuk kelola konten (CRUD) tanpa perlu coding ulang. Login aman & mudah digunakan.' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Performa Cepat', 
                desc: 'Optimasi loading website agar ringan diakses. Penting untuk nilai tugas atau kenyamanan pengunjung.' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: 'Source Code Rapi', 
                desc: 'Struktur kode yang mudah dibaca dan dikembangkan. Sangat membantu jika untuk dipelajari kembali.' 
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: 'Full Support', 
                desc: 'Bantuan gratis saat deploy ke hosting, dan revisi cepat jika ada bug atau error.' 
              },
            ].map((service, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-50/50 hover:border-primary-100"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-primary-200 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Paket & Harga
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pilih paket sesuai kebutuhan Anda. Cocok untuk mahasiswa yang butuh tugas website,
              UKM/organisasi kampus, hingga profesional yang ingin upgrade portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingPackages.length > 0 ? pricingPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="relative bg-white rounded-2xl border border-primary-200 p-8 flex flex-col shadow-lg shadow-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {!!pkg.is_best_seller && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-primary-600 to-blue-500 text-white text-xs font-semibold shadow-lg">
                    🔥 Paling Laku
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-xs font-semibold tracking-[0.2em] text-primary-600 uppercase mb-2">
                    {pkg.category}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pkg.description}
                  </p>
                </div>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-primary-600">
                    Rp{formatPrice(pkg.price_min)}
                  </span>
                  {pkg.price_max && (
                    <span className="text-sm text-gray-500 ml-1">
                      – Rp{formatPrice(pkg.price_max)}
                    </span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-gray-700 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary-600 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={pkg.whatsapp_message 
                    ? `https://wa.me/62895396836264?text=${encodeURIComponent(pkg.whatsapp_message)}`
                    : "#contact"
                  }
                  className={`mt-auto inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${
                    pkg.is_best_seller
                      ? 'bg-gradient-to-r from-primary-600 to-blue-500 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105'
                  }`}
                >
                  {pkg.is_best_seller ? '🚀 Tanyakan Paket Ini' : 'Diskusikan Kebutuhan'}
                </a>
              </div>
            )) : (
              // Fallback jika belum ada data
              <div className="col-span-full text-center py-12 text-gray-500">
                Paket pricing sedang dimuat...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Contoh Hasil Pengerjaan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gambaran tipe website yang biasa kami kerjakan untuk mahasiswa, organisasi, dan profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <div className="w-10/12 space-y-3 opacity-50">
                           <div className="h-3 w-1/2 rounded-full bg-gray-200" />
                           <div className="h-2.5 w-3/4 rounded-full bg-gray-100" />
                        </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-3">
                     <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                        {item.badge || 'Web Project'}
                     </span>
                     {item.project_url && (
                        <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                           Lihat Website ↗
                        </a>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Banyak yang Pakai Jasa Kami?
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Bukan sekadar selesai, tapi rapi, jelas, dan bisa dipertanggungjawabkan saat presentasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Struktur Terarah',
                desc: 'Kami bantu susun urutan section supaya alur cerita di website mudah diikuti dosen maupun klien.',
              },
              {
                title: 'Deadline Friendly',
                desc: 'Terbiasa mengerjakan tugas dan project dengan tenggat waktu ketat, dengan komunikasi jelas dari awal.',
              },
              {
                title: 'Bisa Diupgrade',
                desc: 'Kualitas kode dan struktur dibuat rapi sehingga mudah dikembangkan lagi kalau nanti ingin lebih serius.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-7 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary-100 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features / What You Get Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Semua yang Kamu Dapat dalam Paket
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Bukan cuma file website, tapi juga hal-hal pendukung supaya kamu lebih tenang saat presentasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Struktur folder & file yang rapi',
              'Responsive di laptop & HP',
              'Penamaan komponen / class jelas',
              'Catatan singkat cara run project',
              'Sedikit “script ngomong” saat presentasi',
              'Bantuan kecil kalau ada error mendadak*',
            ].map((feature, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm text-gray-700"
              >
                {feature}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            *Selama masih dalam scope project & masa support yang disepakati.
          </p>
        </div>
      </section>

      {/* About / Approach Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="">
            <div className="text-center mb-20">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-primary-600 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-100">
                Workflow Professional
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Cara Kerja & <span className="text-primary-600">Pendekatan Kami</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Kami membangun website dengan struktur yang jelas, bukan sekadar template jadi.
                Setiap tahap dirancang agar hasil akhirnya rapi, fungsional, dan mudah dipresentasikan.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
              {/* Left Column: Descriptive Text */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Lebih dari Sekadar Coding
                  </h3>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      Kami terbiasa menangani kebutuhan mulai dari <span className="font-semibold text-primary-700">tugas kuliah</span>, 
                      website organisasi, sampai <span className="font-semibold text-primary-700">personal branding</span>. 
                      Fokus kami adalah menciptakan struktur konten yang jelas dan layout yang enak dilihat.
                    </p>
                    <p>
                      Proses dimulai dari pemetaan kebutuhan dan referensi visual yang kamu suka. 
                      Dari situ kami turunkan ke struktur halaman dan komponen, memastikan setiap baris kode 
                      berfungsi optimal sesuai kebutuhanmu.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Dipercaya oleh 50+ Klien
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Process Steps */}
              <div className="space-y-0 relative">
                 {/* Vertical Line Line */}
                 <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-100 hidden md:block"></div>

                 {[
                   { step: '01', title: 'Brief & Requirement', desc: 'Diskusi santai untuk memahami kebutuhan, deadline, dan referensi desain yang diinginkan.' },
                   { step: '02', title: 'Struktur & Wireframe', desc: 'Menyusun kerangka halaman dan alur website agar sesuai dengan tujuan presentasi.' },
                   { step: '03', title: 'Development', desc: 'Implementasi kode menggunakan teknologi modern (React/Tailwind) dengan penulisan rapi.' },
                   { step: '04', title: 'Handover & Support', desc: 'Penyerahan file project, panduan singkat, dan garansi revisi jika ada kendala.' }
                 ].map((item, index) => (
                   <div key={index} className="relative flex gap-6 group hover:bg-gray-50 p-4 rounded-2xl transition-colors">
                      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-primary-100 text-primary-600 font-bold flex items-center justify-center shadow-sm group-hover:border-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                        {item.step}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
              
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Client Repeat Order', value: '60%+', desc: 'Banyak klien kembali untuk project selanjutnya.' },
                { label: 'On-time Delivery', value: '95%+', desc: 'Komitmen tinggi terhadap deadline yang disepakati.' },
                { label: 'Focused Scope', value: '100%', desc: 'Satu project satu fokus, hasil maksimal.' },
              ].map((item, index) => (
                <div key={index} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                  <p className="text-xs font-bold tracking-[0.2em] text-primary-600 uppercase mb-3">
                    {item.label}
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mb-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Beberapa Cerita Klien
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Testimoni singkat dari yang pernah pakai jasa kami untuk tugas kuliah maupun kebutuhan profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Raka — Mahasiswa TI',
                quote:
                  'Tugas web proyek akhir jadi jauh lebih rapi dari yang saya bayangkan. Saat presentasi, dosen fokus ke konsep, bukan sibuk komentar tampilan berantakan.',
              },
              {
                name: 'Nadia — Ketua UKM',
                quote:
                  'Website UKM jadi lebih gampang dibagikan ke calon anggota baru. Semua info kegiatan dan dokumentasi kegabung rapi di satu tempat.',
              },
              {
                name: 'Dimas — Frontend Junior',
                quote:
                  'Portfolio ini yang saya pakai daftar magang & kerja. Recruiter bilang “enak dibaca” dan langsung paham project-project yang pernah saya kerjakan.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  “{item.quote}”
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Beberapa hal yang biasanya ditanyakan sebelum mulai project.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: 'Apakah aman dipakai untuk tugas kuliah?',
                a: 'Kami tetap menyarankan kamu memahami alur dan isi website-nya. Kami bisa bantu jelaskan struktur dan konsep supaya kamu percaya diri saat presentasi.',
              },
              {
                q: 'Berapa lama pengerjaan untuk tugas website?',
                a: 'Rata-rata 3–5 hari kerja untuk tugas standar. Untuk brief yang kompleks atau antrian ramai, estimasi akan dijelaskan di awal.',
              },
              {
                q: 'Apakah bisa revisi setelah diperiksa dosen/klien?',
                a: 'Bisa, selama masih dalam batas revisi yang disepakati di paket dan tidak mengubah scope secara menyeluruh.',
              },
              {
                q: 'Teknologi apa yang digunakan?',
                a: 'Umumnya HTML, CSS (Tailwind), dan JavaScript/React untuk project tertentu. Bisa disesuaikan dengan requirement tugas.',
              },
              {
                q: 'Pembayaran sistemnya bagaimana?',
                a: 'Biasanya DP dulu, pelunasan saat project selesai atau menjelang presentasi, dengan mekanisme yang disepakati bersama.',
              },
            ].map((item, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-xl px-5 py-4 bg-gray-50 open:bg-white open:border-primary-200 transition-colors"
              >
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <span className="text-sm font-medium text-gray-900">
                    {item.q}
                  </span>
                  <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-600 group-open:bg-primary-600 group-open:text-white group-open:border-primary-600 transition-colors">
                    +
                  </span>
                </summary>
                <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Siap Memulai Project?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Hubungi kami sekarang dan diskusikan kebutuhan portfolio web Anda
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl p-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Email</h4>
                    <p className="text-white/90">riskycas23@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl p-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="#25D366">
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">WhatsApp</h4>
                    <p className="text-white/90">+62 895-3968-36264</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl p-2">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="#EA4335">
                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Lokasi</h4>
                    <p className="text-white/90">Karawang, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="space-y-5">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nama Anda" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email Anda" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="No. WhatsApp" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <div>
                  <textarea 
                    rows="5" 
                    placeholder="Ceritakan tentang project Anda..." 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none backdrop-blur-sm"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Riski <span className="text-primary-400">DEV</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Membuat portfolio web profesional untuk meningkatkan kredibilitas dan 
                memperluas jangkauan bisnis Anda.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Navigasi</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Layanan</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Tentang</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: riskycas23@gmail.com</li>
                <li>WhatsApp: +62 895-3968-36264</li>
                <li>Karawang, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Riski DEV. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/62895396836264?text=Halo,%20saya%20ingin%20konsultasi%20tentang%20website%20portfolio"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat WhatsApp"
      >
        <div className="relative">
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50"></div>
          
          {/* Button */}
          <div className="relative bg-green-500 hover:bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110">
            <svg 
              className="w-8 h-8 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat via WhatsApp
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </a>
    </div>
  )
}

export default Home
