import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import BuyerLayout from './components/BuyerLayout'

// Buyer Pages
import BuyerHome from './pages/buyer/BuyerHome'
import BuyerOrders from './pages/buyer/BuyerOrders'
import BuyerRegistration from './pages/buyer/BuyerRegistration'
import ProductDetail from './pages/buyer/ProductDetail'
import RFQDetail from './pages/buyer/RFQDetail'
import OfferDetail from './pages/buyer/OfferDetail'
import OrderDetail from './pages/buyer/OrderDetail'
import BuyerProfile from './pages/buyer/BuyerProfile'
import BuyerEditProfile from './pages/buyer/BuyerEditProfile'
import BuyerEditCompany from './pages/buyer/BuyerEditCompany'
import BuyerUploadDocuments from './pages/buyer/BuyerUploadDocuments'
import CompanyPage from './pages/buyer/CompanyPage'
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import AvailableProducts from './pages/buyer/AvailableProducts'
import CategorySelection from './pages/buyer/CategorySelection'
import RFQForm from './pages/buyer/RFQForm'
import RequestSentConfirmation from './pages/buyer/RequestSentConfirmation'
import UploadPaymentProof from './pages/buyer/UploadPaymentProof'
import FollowingPaymentsSuccess from './pages/buyer/FollowingPaymentsSuccess'
import FirstOrderCongratulations from './pages/buyer/FirstOrderCongratulations'
import BuyerOrderTracking from './pages/buyer/BuyerOrderTracking'
import ContractSent from './pages/buyer/ContractSent'
import ContractView from './pages/buyer/ContractView'
import SupplierProfileView from './pages/buyer/SupplierProfileView'
import ConfirmDelivery from './pages/buyer/ConfirmDelivery'
import DeliveryFeedback from './pages/buyer/DeliveryFeedback'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerOrders from './pages/seller/SellerOrders'
import SellerRequestDetail from './pages/seller/SellerRequestDetail'
import SellerOfferDetail from './pages/seller/SellerOfferDetail'
import SellerOrderDetail from './pages/seller/SellerOrderDetail'
import SellerOrderTracking from './pages/seller/SellerOrderTracking'
import SellerDocumentUpload from './pages/seller/SellerDocumentUpload'
import SellerProfile from './pages/seller/SellerProfile'
import SellerNotifications from './pages/seller/SellerNotifications'
import SellerAnalytics from './pages/seller/SellerAnalytics'
import SellerCompany from './pages/seller/SellerCompany'
import SellerEditProfile from './pages/seller/SellerEditProfile'
import SellerSettingsPanel from './pages/seller/SellerSettingsPanel'
import SellerRegistration from './pages/seller/SellerRegistration'
import SellerAddProduct from './pages/seller/SellerAddProduct'
import SellerProducts from './pages/seller/SellerProducts'
import SellerProductDetail from './pages/seller/SellerProductDetail'
import CounterOffer from './pages/seller/CounterOffer'
import SellerWaitingForBuyerPayment from './pages/seller/SellerWaitingForBuyerPayment'
import SellerWaitingForBuyerConfirmation from './pages/seller/SellerWaitingForBuyerConfirmation'
import SellerDeliveryConfirmedEscrowRelease from './pages/seller/SellerDeliveryConfirmedEscrowRelease'
import SellerEscrowPayoutCompleted from './pages/seller/SellerEscrowPayoutCompleted'
import SellerDeliveryTracking from './pages/seller/SellerDeliveryTracking'
import SellerDeliveryProcess from './pages/seller/SellerDeliveryProcess'
import SellerDeclineRequestWithReason from './pages/seller/SellerDeclineRequestWithReason'
import SellerSkuRevenueDetails from './pages/seller/SellerSkuRevenueDetails'
import SellerProductCertificateUpload from './pages/seller/SellerProductCertificateUpload'
import OfferDeclineConfirmation from './pages/seller/OfferDeclineConfirmation'

// Common Pages
import PaymentConfirmed from './pages/common/PaymentConfirmed'
// import FirstPaymentSuccess from './pages/common/FirstPaymentSuccess'
import DocumentGenerationProgress from './pages/common/DocumentGenerationProgress'
// import DocumentsReadyForPayment from './pages/common/DocumentsReadyForPayment'
import PdfDocumentPreview from './pages/common/PdfDocumentPreview'
import DigitalTtnModal from './pages/common/DigitalTtnModal'
// import ContractGenerationStart from './pages/common/ContractGenerationStart'
// import PayoutInProgress from './pages/common/PayoutInProgress'
import AllMetricsDynamicView from './pages/common/AllMetricsDynamicView'
// import AiSupplierMatcher from './pages/common/AiSupplierMatcher'
// import AiConsultantChat from './pages/common/AiConsultantChat'
// import SendToAlternativeSupplier from './pages/common/SendToAlternativeSupplier'
// import DashboardSettingsPanel from './pages/common/DashboardSettingsPanel'

// Onboarding
import OnboardingWelcome1 from './pages/onboarding/OnboardingWelcome1'
import OnboardingWelcome2 from './pages/onboarding/OnboardingWelcome2'
import RegistrationStep1PhoneVerification from './pages/onboarding/RegistrationStep1PhoneVerification'
import PhoneVerificationCode from './pages/onboarding/PhoneVerificationCode'
import RegistrationStep3ForDealers from './pages/onboarding/RegistrationStep3ForDealers'
import BothRegistration from './pages/common/BothRegistration'

// Auth
import Login from './pages/auth/Login'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Buyer Routes */}
        <Route path="/buyer/home" element={
          <BuyerLayout>
            <BuyerHome />
          </BuyerLayout>
        } />
        <Route path="/buyer/products" element={
          <BuyerLayout>
            <AvailableProducts />
          </BuyerLayout>
        } />
        <Route path="/buyer/category-selection" element={
          <BuyerLayout>
            <CategorySelection />
          </BuyerLayout>
        } />
        <Route path="/buyer/rfq-form" element={
          <BuyerLayout>
            <RFQForm />
          </BuyerLayout>
        } />
            <Route path="/buyer/product/:id" element={
              <BuyerLayout>
                <ProductDetail />
        </BuyerLayout>
        } />
        <Route path="/buyer/rfq/:id" element={
        <BuyerLayout>
          <RFQDetail />
        </BuyerLayout>
        } />
        <Route path="/buyer/offer/:id" element={
          <BuyerLayout>
            <OfferDetail />
          </BuyerLayout>
        } />
        <Route path="/buyer/order/:id" element={
          <BuyerLayout>
            <OrderDetail />
          </BuyerLayout>
        } />
        <Route path="/buyer/orders" element={
          <BuyerLayout>
            <BuyerOrders />
          </BuyerLayout>
        } />
        <Route path="/buyer/upload-payment-proof" element={
          <BuyerLayout>
            <UploadPaymentProof />
          </BuyerLayout>
        } />
        <Route path="/buyer/following-payments-success" element={
          <BuyerLayout>
            <FollowingPaymentsSuccess />
          </BuyerLayout>
        } />
        <Route path="/buyer/first-order-congratulations" element={
          <BuyerLayout>
            <FirstOrderCongratulations />
          </BuyerLayout>
        } />
        <Route path="/buyer/order-tracking/:id" element={
          <BuyerLayout>
            <BuyerOrderTracking />
          </BuyerLayout>
        } />
        <Route path="/buyer/contract-sent" element={
          <BuyerLayout>
            <ContractSent />
          </BuyerLayout>
        } />
        <Route path="/buyer/contract-view" element={
          <BuyerLayout>
            <ContractView />
          </BuyerLayout>
        } />
        <Route path="/buyer/supplier-profile/:id" element={
          <BuyerLayout>
            <SupplierProfileView />
          </BuyerLayout>
        } />
        <Route path="/buyer/request-confirmed" element={
          <BuyerLayout>
            <RequestSentConfirmation />
          </BuyerLayout>
        } />
        <Route path="/buyer/counter-offers" element={
          <BuyerLayout>
            <CounterOffer />
          </BuyerLayout>
        } />
        <Route path="/buyer/notifications" element={
          <BuyerLayout>
            <BuyerOrders />
          </BuyerLayout>
        } />

        <Route path="/buyer/profile" element={
          <BuyerLayout>
            <BuyerProfile />
          </BuyerLayout>
        } />
        <Route path="/buyer/edit-profile" element={
          <BuyerLayout>
            <BuyerEditProfile />
          </BuyerLayout>
        } />
        <Route path="/buyer/edit-company" element={
          <BuyerLayout>
            <BuyerEditCompany />
          </BuyerLayout>
        } />
        <Route path="/buyer/upload-documents" element={
          <BuyerLayout>
            <BuyerUploadDocuments />
          </BuyerLayout>
        } />
        <Route path="/buyer/company" element={
          <BuyerLayout>
            <CompanyPage />
          </BuyerLayout>
        } />
        <Route path="/buyer/dashboard" element={
          <BuyerLayout>
            <BuyerDashboard />
          </BuyerLayout>
        } />
        <Route path="/buyer/registration" element={
          <BuyerLayout>
            <BuyerRegistration />
          </BuyerLayout>
        } />
        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <Layout>
            <SellerDashboard />
          </Layout>
        } />
        <Route path="/seller/orders" element={
          <Layout>
            <SellerOrders />
          </Layout>
        } />
        <Route path="/seller/request-details/:id" element={
          <Layout>
            <SellerRequestDetail />
          </Layout>
        } />
        <Route path="/seller/offer-details/:id" element={
          <Layout>
            <SellerOfferDetail />
          </Layout>
        } />
        <Route path="/seller/order-details/:id" element={
          <Layout>
            <SellerOrderDetail />
          </Layout>
        } />
        <Route path="/seller/order-tracking/:id" element={
          <Layout>
            <SellerOrderTracking />
          </Layout>
        } />
        <Route path="/seller/upload-document/:id" element={
          <Layout>
            <SellerDocumentUpload />
          </Layout>
        } />
        <Route path="/seller/products" element={
          <Layout>
            <SellerProducts />
          </Layout>
        } />
        <Route path="/seller/products/add" element={
          <Layout>
            <SellerAddProduct />
          </Layout>
        } />
        <Route path="/seller/product/:id" element={
          <Layout>
            <SellerProductDetail />
          </Layout>
        } />
        <Route path="/seller/analytics" element={
          <Layout>
            <SellerAnalytics />
          </Layout>
        } />
        <Route path="/seller/notifications" element={
          <Layout>
            <SellerNotifications />
          </Layout>
        } />
        <Route path="/seller/my-company" element={
          <Layout>
            <SellerCompany />
          </Layout>
        } />
        <Route path="/seller/profile" element={
          <Layout>
            <SellerProfile />
          </Layout>
        } />
        <Route path="/seller/settings" element={
          <Layout>
            <SellerSettingsPanel />
          </Layout>
        } />
        <Route path="/seller/registration" element={
          <Layout>
            <SellerRegistration />
          </Layout>
        } />
        <Route path="/seller/waiting-for-buyer-payment" element={
          <Layout>
            <SellerWaitingForBuyerPayment />
          </Layout>
        } />
        <Route path="/seller/waiting-for-buyer-confirmation" element={
          <Layout>
            <SellerWaitingForBuyerConfirmation />
          </Layout>
        } />
        <Route path="/seller/delivery-confirmed-escrow-release" element={
          <Layout>
            <SellerDeliveryConfirmedEscrowRelease />
          </Layout>
        } />
        <Route path="/seller/escrow-payout-completed" element={
          <Layout>
            <SellerEscrowPayoutCompleted />
          </Layout>
        } />
        <Route path="/seller/delivery-tracking/:id" element={
          <Layout>
            <SellerDeliveryTracking />
          </Layout>
        } />
        <Route path="/seller/delivery-process/:id" element={
          <Layout>
            <SellerDeliveryProcess />
          </Layout>
        } />
        <Route path="/seller/decline-request/:id" element={
          <Layout>
            <SellerDeclineRequestWithReason />
          </Layout>
        } />
        <Route path="/seller/sku-revenue-details" element={
          <Layout>
            <SellerSkuRevenueDetails />
          </Layout>
        } />
        <Route path="/seller/product-certificate-upload/:id" element={
          <Layout>
            <SellerProductCertificateUpload />
          </Layout>
        } />
        <Route path="/offer/decline-confirmation/:id" element={
          <Layout>
            <OfferDeclineConfirmation />
          </Layout>
        } />
        {/* Both Role Routes */}
        <Route path="/both/registration" element={
          <Layout>
            <BothRegistration />
          </Layout>
        } />

        {/* Common Routes */}
        <Route path="/payment-confirmed" element={
          <Layout>
            <PaymentConfirmed />
          </Layout>
        } />
        <Route path="/buyer/confirm-delivery" element={
          <BuyerLayout>
            <ConfirmDelivery />
          </BuyerLayout>
        } />
        <Route path="/buyer/delivery-feedback" element={
          <BuyerLayout>
            <DeliveryFeedback />
          </BuyerLayout>
        } />
        {/* <Route path="/first-payment-success" element={
          <Layout>
            <FirstPaymentSuccess />
          </Layout>
        } /> */}
        <Route path="/document-generation-progress" element={
          <Layout>
            <DocumentGenerationProgress />
          </Layout>
        } />
        <Route path="/pdf-document-preview" element={
          <Layout>
            <PdfDocumentPreview />
          </Layout>
        } />
        <Route path="/digital-ttn-modal" element={
          <Layout>
            <DigitalTtnModal />
          </Layout>
        } />
        {/* <Route path="/contract-generation-start" element={
          <Layout>
            <ContractGenerationStart />
          </Layout>
        } /> */}
        {/* <Route path="/payout-in-progress" element={
          <Layout>
            <PayoutInProgress />
          </Layout>
        } /> */}
        <Route path="/all-metrics-dynamic-view" element={
          <Layout>
            <AllMetricsDynamicView />
          </Layout>
        } />
        {/* <Route path="/ai-supplier-matcher" element={
          <Layout>
            <AiSupplierMatcher />
          </Layout>
        } /> */}
        {/* <Route path="/ai-consultant-chat" element={
          <Layout>
            <AiConsultantChat />
          </Layout>
        } /> */}
        {/* <Route path="/send-to-alternative-supplier" element={
          <Layout>
            <SendToAlternativeSupplier />
          </Layout>
        } /> */}
        {/* <Route path="/dashboard-settings-panel" element={
          <Layout>
            <DashboardSettingsPanel />
          </Layout>
        } /> */}
        <Route path="/registration/step-1" element={
          <Layout>
            <RegistrationStep1PhoneVerification />
          </Layout>
        } />
        <Route path="/registration/phone-verification-code" element={
          <Layout>
            <PhoneVerificationCode />
          </Layout>
        } />
        <Route path="/registration/step-3" element={
          <Layout>
            <RegistrationStep3ForDealers />
          </Layout>
        } />

        {/* Auth Routes */}
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout>
            <OnboardingWelcome2 />
          </Layout>
        } />

        {/* Default route */}
        <Route path="/" element={
          <Layout>
            <OnboardingWelcome1 />
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
