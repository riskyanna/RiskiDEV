import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalOrders: 0 })
  const navigate = useNavigate()

  // Content Type State (Web vs App)
  const [activeType, setActiveType] = useState('web')

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [currentItem, setCurrentItem] = useState({ title: '', category: '', image_url: '', description: '', project_url: '' })

  // Pricing State
  const [pricingPackages, setPricingPackages] = useState([])
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [currentPricing, setCurrentPricing] = useState({
    name: '', category: '', price_min: '', price_max: '', 
    description: '', features: [''], is_best_seller: false, whatsapp_message: ''
  })

  useEffect(() => {
    checkUser()
    fetchStats()
  }, [])

  useEffect(() => {
    fetchPortfolio()
    fetchPricing()
  }, [activeType])

  const checkUser = () => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/admin')
    }
    setLoading(false)
  }

  const fetchStats = async () => {
    try {
      const data = await api.getStats()
      if (data) {
        setStats(prev => ({ ...prev, totalOrders: data.totalOrders || 0 }))
      }
    } catch (error) {
      console.error('Failed to fetch stats', error)
    }
  }

  const fetchPortfolio = async () => {
    try {
      const data = await api.getPortfolio(activeType)
      if (data) setPortfolioItems(data)
    } catch (error) {
       console.error('Failed to fetch portfolio', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/admin')
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSavePortfolio = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', currentItem.title)
      formData.append('category', currentItem.category)
      formData.append('description', currentItem.description)
      formData.append('project_url', currentItem.project_url)
      formData.append('item_type', activeType)
      
      if (file) {
        formData.append('image', file)
      } else if (currentItem.image_url) {
        formData.append('image_url', currentItem.image_url)
      }

      let response;
      if (currentItem.id) {
        response = await api.updatePortfolio(currentItem.id, formData)
      } else {
        response = await api.addPortfolio(formData)
      }

      if (response.success) {
        setIsModalOpen(false)
        setCurrentItem({ id: null, title: '', category: '', image_url: '', description: '', project_url: '' })
        setFile(null)
        fetchPortfolio()
      } else {
        alert('Error saving portfolio')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleEditPortfolio = (item) => {
    setCurrentItem({ ...item })
    setIsModalOpen(true)
  }

  const handleDeletePortfolio = async (id) => {
    if(!confirm('Yakin hapus project ini?')) return
    try {
       await api.deletePortfolio(id)
       fetchPortfolio()
    } catch (error) {
       alert('Failed to delete')
    }
  }

  // Pricing Functions
  const fetchPricing = async () => {
    try {
      const data = await api.getPricing(activeType)
      if (data) setPricingPackages(data)
    } catch (error) {
      console.error('Failed to fetch pricing', error)
    }
  }

  const handleSavePricing = async (e) => {
    e.preventDefault()
    try {
      const pricingData = {
        ...currentPricing,
        price_min: parseFloat(currentPricing.price_min),
        price_max: currentPricing.price_max ? parseFloat(currentPricing.price_max) : null,
        features: currentPricing.features.filter(f => f.trim() !== ''),
        item_type: activeType
      }
      
      let response;
      if (currentPricing.id) {
        response = await api.updatePricing(currentPricing.id, pricingData)
      } else {
        response = await api.addPricing(pricingData)
      }

      if (response.success) {
        setIsPricingModalOpen(false)
        setCurrentPricing({
          id: null, name: '', category: '', price_min: '', price_max: '',
          description: '', features: [''], is_best_seller: false, whatsapp_message: ''
        })
        fetchPricing()
      } else {
        alert('Error saving pricing')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }
  
  const handleEditPricing = (pkg) => {
    setCurrentPricing({ 
        ...pkg, 
        features: Array.isArray(pkg.features) ? pkg.features : (pkg.features ? JSON.parse(pkg.features) : [''])
    })
    setIsPricingModalOpen(true)
  }

  const handleDeletePricing = async (id) => {
    if(!confirm('Yakin hapus paket ini?')) return
    try {
      await api.deletePricing(id)
      fetchPricing()
    } catch (error) {
      alert('Failed to delete')
    }
  }

  const addFeatureField = () => {
    setCurrentPricing(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const updateFeature = (index, value) => {
    setCurrentPricing(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }))
  }

  const removeFeature = (index) => {
    setCurrentPricing(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-500 font-medium">Memuat data...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-30 hidden md:flex flex-col shadow-sm">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 text-primary-600 mb-8">
            <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              ⚡
            </span>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Admin<span className="text-primary-600">Panel</span></h2>
          </div>
          
          <nav className="space-y-1">
            <NavItem 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
              icon="📊" 
              label="Overview" 
            />
            <NavItem 
              active={activeTab === 'portfolio'} 
              onClick={() => setActiveTab('portfolio')} 
              icon="💼" 
              label="Portfolio" 
            />
            <NavItem 
              active={activeTab === 'pricing'} 
              onClick={() => setActiveTab('pricing')} 
              icon="💰" 
              label="Pricing" 
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
           <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-full px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <span>🚪</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900">Admin Panel</h2>
          <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
        </div>

        {/* Type Switcher */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-sm">
           <button 
             onClick={() => setActiveType('web')}
             className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeType === 'web' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
           >
             <span>🖥️</span> Website
           </button>
           <button 
             onClick={() => setActiveType('app')}
             className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeType === 'app' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
           >
             <span>📱</span> Mobile App
           </button>
        </div>

        {activeTab === 'overview' && (
          <div className="max-w-5xl mx-auto animate-fadeIn">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Halo, Admin! 👋</h1>
              <p className="text-gray-500">
                 Mode: <span className={`font-bold ${activeType === 'web' ? 'text-gray-900' : 'text-indigo-600'}`}>
                    {activeType === 'web' ? 'Website Projects' : 'Mobile App Projects'}
                 </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                value={stats.totalOrders} 
                icon="🔥" 
                color="bg-orange-50 text-orange-600" 
              />
              <StatCard 
                label="Total Portfolio" 
                value={portfolioItems.length} 
                icon="🚀" 
                color="bg-blue-50 text-blue-600" 
              />
              <StatCard 
                label="Status Server" 
                value="Online" 
                icon="🟢" 
                color="bg-green-50 text-green-600" 
              />
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Portfolio Manager</h1>
                <p className="text-gray-500">Kelola hasil karyamu yang ditampilkan di halaman depan.</p>
              </div>
              <button 
                onClick={() => {
                  setCurrentItem({ id: null, title: '', category: '', image_url: '', description: '', project_url: '' })
                  setFile(null)
                  setIsModalOpen(true)
                }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-0.5"
              >
                <span>+</span> Tambah Project
              </button>
            </div>

            {portfolioItems.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-4">📂</div>
                  <h3 className="text-lg font-medium text-gray-900">Belum ada portfolio</h3>
                  <p className="text-gray-500 mb-6">Yuk tambahkan project pertamamu!</p>
                  <button onClick={() => {
                     setCurrentItem({ id: null, title: '', category: '', image_url: '', description: '', project_url: '' })
                     setFile(null)
                     setIsModalOpen(true)
                  }} className="text-primary-600 font-medium hover:underline">Tambah Sekarang</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioItems.map(item => (
                      <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                              {item.image_url ? (
                                <img src={item.image_url} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                                  <span className="text-2xl mb-2">🖼️</span>
                                  <span className="text-xs">No Image</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                <button onClick={() => handleEditPortfolio(item)} className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100 font-medium text-xs">Edit</button>
                                <button onClick={() => handleDeletePortfolio(item.id)} className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 font-medium text-xs">Hapus</button>
                              </div>
                          </div>
                          <div className="p-5">
                              <div className="mb-2">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  item.category === 'Mahasiswa' ? 'bg-blue-50 text-blue-600' :
                                  item.category === 'Organisasi' ? 'bg-purple-50 text-purple-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {item.category}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{item.title}</h3>
                              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pricing Manager</h1>
                <p className="text-gray-500">Kelola paket harga yang ditampilkan di halaman depan.</p>
              </div>
              <button 
                onClick={() => {
                  setCurrentPricing({
                    id: null, name: '', category: '', price_min: '', price_max: '',
                    description: '', features: [''], is_best_seller: false, whatsapp_message: ''
                  })
                  setIsPricingModalOpen(true)
                }}
                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 transform hover:-translate-y-0.5"
              >
                <span>+</span> Tambah Paket
              </button>
            </div>

            {pricingPackages.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-gray-900">Belum ada paket pricing</h3>
                  <p className="text-gray-500 mb-6">Yuk tambahkan paket pertamamu!</p>
                  <button onClick={() => {
                        setCurrentPricing({
                          id: null, name: '', category: '', price_min: '', price_max: '',
                          description: '', features: [''], is_best_seller: false, whatsapp_message: ''
                        })
                        setIsPricingModalOpen(true)
                  }} className="text-primary-600 font-medium hover:underline">Tambah Sekarang</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pricingPackages.map(pkg => (
                      <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
                          {!!pkg.is_best_seller && (
                            <div className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold mb-3">
                              Best Seller
                            </div>
                          )}
                          <h3 className="font-bold text-gray-900 text-xl mb-1">{pkg.name}</h3>
                          <p className="text-sm text-primary-600 font-semibold mb-2">{pkg.category}</p>
                          <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                          
                          <div className="mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                              Rp{pkg.price_min.toLocaleString('id-ID')}
                            </span>
                            {pkg.price_max && (
                              <span className="text-sm text-gray-500 ml-1">
                                - Rp{pkg.price_max.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                            <ul className="space-y-1">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="text-sm text-gray-600">• {feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => handleEditPricing(pkg)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeletePricing(pkg.id)}
                              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
                            >
                              Hapus
                            </button>
                          </div>
                      </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Tambah Project Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSavePortfolio} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormGroup label={activeType === 'web' ? "Judul Website" : "Nama Aplikasi"}>
                     <input 
                       className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                       value={currentItem.title} 
                       onChange={e => setCurrentItem({...currentItem, title: e.target.value})} 
                       placeholder={activeType === 'web' ? "Contoh: Website Himpunan" : "Contoh: MySuperApp Android/iOS"}
                       required 
                    />
                 </FormGroup>

                 <FormGroup label="Kategori">
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-white" 
                      value={currentItem.category} 
                      onChange={e => setCurrentItem({...currentItem, category: e.target.value})}
                      required
                    >
                        <option value="">Pilih Kategori</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Organisasi">Organisasi Kampus</option>
                        <option value="Profesional">Profesional / Bisnis</option>
                        <option value="Event">Event / Acara</option>
                        <option value="UMKM">UMKM</option>
                    </select>
                 </FormGroup>

                 <FormGroup label="Gambar Project" className="md:col-span-2">
                     <div className="flex flex-col gap-3">
                         {/* File Upload Option */}
                         <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 transition-colors text-center cursor-pointer group">
                        <input 
                           type="file" 
                           onChange={handleFileChange}
                           className="hidden" 
                           id="image-upload"
                           accept="image/*"
                         />
                         <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
                            <span className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</span>
                         </label>
                         {file && <p className="text-xs text-primary-600 mt-2 font-semibold">{file.name}</p>}
                     </div>
                     <div className="text-center text-sm text-gray-400 font-medium">- ATAU -</div>
                     <div>
                         <input 
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                            placeholder="Paste link gambar (opsional)" 
                            value={currentItem.image_url || ''} 
                            onChange={e => setCurrentItem({...currentItem, image_url: e.target.value})} 
                         />
                     </div>
                     </div>
                 </FormGroup>

                  <FormGroup label={activeType === 'web' ? "Link Website (Opsional)" : "Link Download / Demo (Opsional)"} className="md:col-span-2">
                     <input 
                       className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                       placeholder={activeType === 'web' ? "https://contoh-website-klien.com" : "https://play.google.com/store/apps/..."} 
                       value={currentItem.project_url || ''} 
                       onChange={e => setCurrentItem({...currentItem, project_url: e.target.value})} 
                     />
                  </FormGroup>

                 <FormGroup label="Deskripsi Project" className="md:col-span-2">
                    <textarea 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all h-24 resize-none" 
                       value={currentItem.description || ''} 
                       onChange={e => setCurrentItem({...currentItem, description: e.target.value})} 
                       placeholder={activeType === 'web' ? "Jelaskan sedikit tentang project ini..." : "Jelaskan fitur utama dan teknologi yang digunakan..."}
                    />
                 </FormGroup>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                >
                  Simpan Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Modal Form */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Tambah Paket Pricing</h3>
              <button onClick={() => setIsPricingModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSavePricing} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 {/* Dynamic Pricing Modal Labels */}
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder={activeType === 'web' ? "Contoh: Tugas Website Kuliah" : "Contoh: Aplikasi Skripsi Android"}
                        value={currentPricing.name || ''} 
                        onChange={e => setCurrentPricing({...currentPricing, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <input 
                          type="text" 
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder={activeType === 'web' ? "Contoh: Paket Mahasiswa" : "Contoh: Paket Startup"}
                          value={currentPricing.category || ''} 
                          onChange={e => setCurrentPricing({...currentPricing, category: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                         <label className="flex items-center cursor-pointer gap-2">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                              checked={!!currentPricing.is_best_seller}
                              onChange={e => setCurrentPricing({...currentPricing, is_best_seller: e.target.checked})}
                            />
                            <span className="text-sm font-medium text-gray-700">Best Seller?</span>
                         </label>
                      </div>
                    </div>
                  </div>

                 <FormGroup label="Harga Minimum (Rp)">
                    <input 
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                      value={currentPricing.price_min || ''} 
                      onChange={e => setCurrentPricing({...currentPricing, price_min: e.target.value})} 
                      placeholder="150000"
                      required 
                    />
                 </FormGroup>

                 <FormGroup label="Harga Maximum (Rp) - Opsional">
                    <input 
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                      value={currentPricing.price_max || ''} 
                      onChange={e => setCurrentPricing({...currentPricing, price_max: e.target.value})} 
                      placeholder="250000"
                    />
                 </FormGroup>

                 <FormGroup label="Deskripsi" className="md:col-span-2">
                    <textarea 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all h-20 resize-none" 
                      value={currentPricing.description || ''} 
                      onChange={e => setCurrentPricing({...currentPricing, description: e.target.value})} 
                      placeholder="Jelaskan untuk siapa paket ini..."
                      required
                    />
                 </FormGroup>

                 <FormGroup label="Features" className="md:col-span-2">
                    <div className="space-y-2">
                      {currentPricing.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                            value={feature || ''} 
                            onChange={e => updateFeature(idx, e.target.value)} 
                            placeholder={`Feature ${idx + 1}`}
                          />
                          {currentPricing.features.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeFeature(idx)}
                              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        type="button"
                        onClick={addFeatureField}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        + Tambah Feature
                      </button>
                    </div>
                 </FormGroup>

                 <FormGroup label="Pesan WhatsApp (Opsional)" className="md:col-span-2">
                    <input 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all" 
                      value={currentPricing.whatsapp_message || ''} 
                      onChange={e => setCurrentPricing({...currentPricing, whatsapp_message: e.target.value})} 
                      placeholder="Halo, saya ingin konsultasi tentang..."
                    />
                 </FormGroup>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsPricingModalOpen(false)} 
                  className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                >
                  Simpan Paket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// UI Components
function NavItem({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function FormGroup({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  )
}
