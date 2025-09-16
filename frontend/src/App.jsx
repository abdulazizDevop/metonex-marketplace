import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Landing from './pages/Landing.jsx'
import CompanySetup from './pages/CompanySetup.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import SellerRequests from './pages/seller/SellerRequests.jsx'
import ItemsList from './pages/items/ItemsList.jsx'
import ItemDetail from './pages/items/ItemDetail.jsx'
import ItemEdit from './pages/items/ItemEdit.jsx'
import ItemImagesEdit from './pages/items/ItemImagesEdit.jsx'
import CompanyProfile from './pages/company/CompanyProfile.jsx'
import Profile from './pages/Profile.jsx'
import Notifications from './pages/notifications/Notifications.jsx'
import ItemCreate from './pages/items/ItemCreate.jsx'
import RequestCreate from './pages/requests/RequestCreate.jsx'
import RequestDetail from './pages/requests/RequestDetail.jsx'
import MyRequests from './pages/requests/MyRequests.jsx'
import OrderDetail from './pages/orders/OrderDetail.jsx'
import BuyerOrdersList from './pages/buyer/BuyerOrdersList.jsx'
import SellerOrdersList from './pages/seller/SellerOrdersList.jsx'
import BuyerDashboard from './pages/buyer/BuyerDashboard.jsx'
import BuyerCatalog from './pages/buyer/BuyerCatalog.jsx'
import BuyerItemDetail from './pages/buyer/BuyerItemDetail.jsx'
import BuyerProfile from './pages/buyer/BuyerProfile.jsx'
import BuyerCart from './pages/buyer/BuyerCart.jsx'
import BuyerCreateRequest from './pages/buyer/BuyerCreateRequest.jsx'
import BuyerRequests from './pages/buyer/BuyerRequests.jsx'
import BuyerRequestDetail from './pages/buyer/BuyerRequestDetail.jsx'
import BuyerNotifications from './pages/buyer/BuyerNotifications.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

function BuyerLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        {children}
      </main>
      <Footer />
    </div>
  )
}

function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-3">
        <h1>Qurilish materiallari uchun raqobatli marketplace</h1>
        <p className="muted">Bir ekranda bir vazifa. Minimalizm. Intuitiv interfeys.</p>
        <div className="flex gap-3 pt-2">
          <Link to="/register" className="btn-primary">Boshlash</Link>
          <Link to="/login" className="btn-outline">Kirish</Link>
        </div>
      </div>
      <div className="card p-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass rounded-lg p-3">
            <div className="badge mb-2">Tez taklif</div>
            <div className="font-medium text-gray-900">TTF-Offer (P90) ≤ 10m</div>
          </div>
          <div className="glass rounded-lg p-3">
            <div className="badge mb-2">Konversiya</div>
            <div className="font-medium text-gray-900">Request→Offer ≥ 80%</div>
          </div>
          <div className="glass rounded-lg p-3">
            <div className="badge mb-2">Qabul</div>
            <div className="font-medium text-gray-900">Offer→Work 30–35%</div>
          </div>
          <div className="glass rounded-lg p-3">
            <div className="badge mb-2">Chempion CTR</div>
            <div className="font-medium text-gray-900">≥ 15%</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  useEffect(()=>{
    const root = document.documentElement
    root.classList.add('page-enter')
    const t = setTimeout(()=>{ root.classList.remove('page-enter') }, 500)
    return ()=> clearTimeout(t)
  }, [])
  return (
    <Routes>
      {/* Buyer Routes with separate layout */}
      <Route path="/buyer" element={
        <BuyerLayout>
          <BuyerDashboard />
        </BuyerLayout>
      } />
      <Route path="/buyer/catalog" element={
        <BuyerLayout>
          <BuyerCatalog />
        </BuyerLayout>
      } />
      <Route path="/buyer/items/:id" element={
        <BuyerLayout>
          <BuyerItemDetail />
        </BuyerLayout>
      } />
      <Route path="/buyer/profile" element={
        <BuyerLayout>
          <BuyerProfile />
        </BuyerLayout>
      } />
      <Route path="/buyer/notifications" element={
        <BuyerLayout>
          <BuyerNotifications />
        </BuyerLayout>
      } />
      <Route path="/buyer/cart" element={
        <BuyerLayout>
          <BuyerCart />
        </BuyerLayout>
      } />
      <Route path="/buyer/requests" element={
        <BuyerLayout>
          <BuyerRequests />
        </BuyerLayout>
      } />
      <Route path="/buyer/requests/create" element={
        <BuyerLayout>
          <BuyerCreateRequest />
        </BuyerLayout>
      } />
      <Route path="/buyer/requests/:id" element={
        <BuyerLayout>
          <BuyerRequestDetail />
        </BuyerLayout>
      } />
      <Route path="/buyer/orders" element={
        <BuyerLayout>
          <BuyerOrdersList />
        </BuyerLayout>
      } />
      
      {/* Other routes with main layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/company-setup" element={<CompanySetup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/requests" element={<SellerRequests />} />
            <Route path="/items" element={<ItemsList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/items/:id/edit" element={<ItemEdit />} />
            <Route path="/items/:id/images" element={<ItemImagesEdit />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/items/new" element={<ItemCreate />} />
            <Route path="/requests/new" element={<RequestCreate />} />
            <Route path="/requests/my" element={<MyRequests />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/orders/seller" element={<SellerOrdersList />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}
