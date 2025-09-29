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


// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerOrders from './pages/seller/SellerOrders'
import SellerRequestDetail from './pages/seller/SellerRequestDetail'
import SellerOfferDetail from './pages/seller/SellerOfferDetail'
import SellerOrderDetail from './pages/seller/SellerOrderDetail'
import SellerProfile from './pages/seller/SellerProfile'
import SellerNotifications from './pages/seller/SellerNotifications'
import SellerAnalytics from './pages/seller/SellerAnalytics'
import SellerCompany from './pages/seller/SellerCompany'
import SellerEditProfile from './pages/seller/SellerEditProfile'
import SellerSettingsPanel from './pages/seller/SellerSettingsPanel'
import SellerRegistration from './pages/seller/SellerRegistration'
import SupplierAddProduct from './pages/seller/SupplierAddProduct'
import SellerProducts from './pages/seller/SellerProducts'
import SellerProductDetail from './pages/seller/SellerProductDetail'
import SupplierMyRequests from './pages/seller/SupplierMyRequests'
import SupplierAcceptance from './pages/seller/SupplierAcceptance'
import ConfirmDelivery from './pages/buyer/ConfirmDelivery'
import CounterOffer from './pages/seller/CounterOffer'
import FullOrderDetails from './pages/seller/FullOrderDetails'
import OfferAcceptancePayment from './pages/seller/OfferAcceptancePayment'

// Common Pages
import PaymentConfirmed from './pages/common/PaymentConfirmed'
import DeliveryFeedback from './pages/buyer/DeliveryFeedback'
import UploadPaymentProof from './pages/common/UploadPaymentProof'
import FirstPaymentSuccess from './pages/common/FirstPaymentSuccess'
import FollowingPaymentsSuccess from './pages/common/FollowingPaymentsSuccess'
import FirstOrderCongratulations from './pages/common/FirstOrderCongratulations'
import PreparingShipment1 from './pages/common/PreparingShipment1'
import PreparingShipment2 from './pages/common/PreparingShipment2'
import DocumentGenerationProgress from './pages/common/DocumentGenerationProgress'
import DocumentsReadyForPayment from './pages/common/DocumentsReadyForPayment'
import PdfDocumentPreview from './pages/common/PdfDocumentPreview'
import DigitalTtnModal from './pages/common/DigitalTtnModal'
import ContractGenerationStart from './pages/common/ContractGenerationStart'
import UploadInvoice from './pages/common/UploadInvoice'
import ManageProductListings from './pages/common/ManageProductListings'
import WaitingForBuyerPayment from './pages/common/WaitingForBuyerPayment'
import WaitingForBuyerConfirmation from './pages/common/WaitingForBuyerConfirmation'
import DeliveryTrackingSupplier from './pages/common/DeliveryTrackingSupplier'
import DeliveryConfirmedEscrowRelease from './pages/common/DeliveryConfirmedEscrowRelease'
import PayoutInProgress from './pages/common/PayoutInProgress'
import EscrowPayoutCompleted from './pages/common/EscrowPayoutCompleted'
import ManageTeamMembers from './pages/common/ManageTeamMembers'
import AllMetricsDynamicView from './pages/common/AllMetricsDynamicView'
import AnonymizedSupplierProfile from './pages/common/AnonymizedSupplierProfile'
import AiSupplierMatcher from './pages/common/AiSupplierMatcher'
import AiConsultantChat from './pages/common/AiConsultantChat'
import DeclineRequestWithReason from './pages/common/DeclineRequestWithReason'
import SendToAlternativeSupplier from './pages/common/SendToAlternativeSupplier'
import SkuRevenueDetails from './pages/common/SkuRevenueDetails'
import ReviewFilterSort from './pages/common/ReviewFilterSort'
import DashboardSettingsPanel from './pages/common/DashboardSettingsPanel'
import SupplierDeliveryProcess from './pages/common/SupplierDeliveryProcess'

// Onboarding
import OnboardingWelcome1 from './pages/onboarding/OnboardingWelcome1'
import OnboardingWelcome2 from './pages/onboarding/OnboardingWelcome2'
import RegistrationStep1PhoneVerification from './pages/onboarding/RegistrationStep1PhoneVerification'
import PhoneVerificationCode from './pages/onboarding/PhoneVerificationCode'
import RegistrationStep3ForDealers from './pages/onboarding/RegistrationStep3ForDealers'
import BothRegistration from './pages/common/BothRegistration'

// Auth
import Login from './pages/auth/Login'

// Product
import ProductCertificateUpload from './pages/product/ProductCertificateUpload'

// Offer
import OfferDeclineConfirmation from './pages/offer/OfferDeclineConfirmation'

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
        <Route path="/seller/products" element={
          <Layout>
            <SellerProducts />
          </Layout>
        } />
        <Route path="/seller/products/add" element={
          <Layout>
            <SupplierAddProduct />
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
        <Route path="/offer-acceptance-payment" element={
          <Layout>
            <OfferAcceptancePayment />
          </Layout>
        } />
        <Route path="/counter-offer" element={
          <Layout>
            <CounterOffer />
          </Layout>
        } />
        <Route path="/buyer/confirm-delivery" element={
          <Layout>
            <ConfirmDelivery />
          </Layout>
        } />
        <Route path="/buyer/delivery-feedback" element={
          <Layout>
            <DeliveryFeedback />
          </Layout>
        } />
        <Route path="/upload-payment-proof" element={
          <Layout>
            <UploadPaymentProof />
          </Layout>
        } />
        <Route path="/first-payment-success" element={
          <Layout>
            <FirstPaymentSuccess />
          </Layout>
        } />
        <Route path="/following-payments-success" element={
          <Layout>
            <FollowingPaymentsSuccess />
          </Layout>
        } />
        <Route path="/first-order-congratulations" element={
          <Layout>
            <FirstOrderCongratulations />
          </Layout>
        } />

        <Route path="/full-order-details" element={
          <Layout>
            <FullOrderDetails />
          </Layout>
        } />
        <Route path="/preparing-shipment-1" element={
          <Layout>
            <PreparingShipment1 />
          </Layout>
        } />
        <Route path="/preparing-shipment-2" element={
          <Layout>
            <PreparingShipment2 />
          </Layout>
        } />
        <Route path="/document-generation-progress" element={
          <Layout>
            <DocumentGenerationProgress />
          </Layout>
        } />
        <Route path="/documents-ready-for-payment" element={
          <Layout>
            <DocumentsReadyForPayment />
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
        <Route path="/contract-generation-start" element={
          <Layout>
            <ContractGenerationStart />
          </Layout>
        } />
        <Route path="/upload-invoice" element={
          <Layout>
            <UploadInvoice />
          </Layout>
        } />
        <Route path="/manage-product-listings" element={
          <Layout>
            <ManageProductListings />
          </Layout>
        } />
        <Route path="/waiting-for-buyer-payment" element={
          <Layout>
            <WaitingForBuyerPayment />
          </Layout>
        } />
        <Route path="/waiting-for-buyer-confirmation" element={
          <Layout>
            <WaitingForBuyerConfirmation />
          </Layout>
        } />
        <Route path="/delivery-tracking-supplier" element={
          <Layout>
            <DeliveryTrackingSupplier />
          </Layout>
        } />
        <Route path="/delivery-confirmed-escrow-release" element={
          <Layout>
            <DeliveryConfirmedEscrowRelease />
          </Layout>
        } />
        <Route path="/payout-in-progress" element={
          <Layout>
            <PayoutInProgress />
          </Layout>
        } />
        <Route path="/escrow-payout-completed" element={
          <Layout>
            <EscrowPayoutCompleted />
          </Layout>
        } />
        <Route path="/manage-team-members" element={
          <Layout>
            <ManageTeamMembers />
          </Layout>
        } />
        <Route path="/all-metrics-dynamic-view" element={
          <Layout>
            <AllMetricsDynamicView />
          </Layout>
        } />
        <Route path="/anonymized-supplier-profile" element={
          <Layout>
            <AnonymizedSupplierProfile />
          </Layout>
        } />
        <Route path="/ai-supplier-matcher" element={
          <Layout>
            <AiSupplierMatcher />
          </Layout>
        } />
        <Route path="/ai-consultant-chat" element={
          <Layout>
            <AiConsultantChat />
          </Layout>
        } />
        <Route path="/decline-request-with-reason" element={
          <Layout>
            <DeclineRequestWithReason />
          </Layout>
        } />
        <Route path="/send-to-alternative-supplier" element={
          <Layout>
            <SendToAlternativeSupplier />
          </Layout>
        } />
        <Route path="/sku-revenue-details" element={
          <Layout>
            <SkuRevenueDetails />
          </Layout>
        } />
        <Route path="/review-filter-sort" element={
          <Layout>
            <ReviewFilterSort />
          </Layout>
        } />
        <Route path="/dashboard-settings-panel" element={
          <Layout>
            <DashboardSettingsPanel />
          </Layout>
        } />
        <Route path="/supplier-delivery-process" element={
          <Layout>
            <SupplierDeliveryProcess />
          </Layout>
        } />
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

        {/* Product Routes */}
        <Route path="/product/certificate-upload" element={
          <Layout>
            <ProductCertificateUpload />
          </Layout>
        } />

        {/* Offer Routes */}
        <Route path="/offer/decline-confirmation" element={
          <Layout>
            <OfferDeclineConfirmation />
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
