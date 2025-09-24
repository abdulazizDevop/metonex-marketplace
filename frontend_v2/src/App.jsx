import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import BuyerLayout from './components/BuyerLayout'

// Pages
import BuyerHomeScreen1 from './pages/buyer/BuyerHomeScreen1'
import BuyerHomeScreen2 from './pages/buyer/BuyerHomeScreen2'
import BuyerHomeScreen3 from './pages/buyer/BuyerHomeScreen3'
import BuyerHomeScreen4 from './pages/buyer/BuyerHomeScreen4'
import BuyerRegistration from './pages/buyer/BuyerRegistration'
import BuyerDashboard1 from './pages/buyer/BuyerDashboard1'
import BuyerDashboard2 from './pages/buyer/BuyerDashboard2'
import BuyerOffers from './pages/buyer/BuyerOffers'
import BuyerHomeOffersReceived from './pages/buyer/BuyerHomeOffersReceived'

// Seller Pages
import SellerHomeScreen1 from './pages/seller/SellerHomeScreen1'
import SellerHomeScreen2 from './pages/seller/SellerHomeScreen2'
import SellerHomeScreen3 from './pages/seller/SellerHomeScreen3'
import SellerWelcome from './pages/seller/SellerWelcome'
import SellerProfileDetails1 from './pages/seller/SellerProfileDetails1'
import SellerProfileDetails2 from './pages/seller/SellerProfileDetails2'
import SellerProfileDetails3 from './pages/seller/SellerProfileDetails3'
import SellerAnalyticsSummary from './pages/seller/SellerAnalyticsSummary'
import SellerAnalyticsDeepDive1 from './pages/seller/SellerAnalyticsDeepDive1'
import SellerAnalyticsDeepDive2 from './pages/seller/SellerAnalyticsDeepDive2'
import SellerEditProfile from './pages/seller/SellerEditProfile'
import SellerSettingsPanel from './pages/seller/SellerSettingsPanel'
import SupplierAddProduct from './pages/seller/SupplierAddProduct'
import SupplierMyRequests from './pages/seller/SupplierMyRequests'
import SupplierAcceptance from './pages/seller/SupplierAcceptance'
import SupplierRoleSelection from './pages/seller/SupplierRoleSelection'

// Common Pages
import PaymentConfirmed from './pages/common/PaymentConfirmed'
import OfferAcceptancePayment from './pages/common/OfferAcceptancePayment'
import CounterOffer from './pages/common/CounterOffer'
import ConfirmDelivery from './pages/common/ConfirmDelivery'
import DeliveryFeedback from './pages/common/DeliveryFeedback'
import UploadPaymentProof from './pages/common/UploadPaymentProof'
import FirstPaymentSuccess from './pages/common/FirstPaymentSuccess'
import FollowingPaymentsSuccess from './pages/common/FollowingPaymentsSuccess'
import FirstOrderCongratulations from './pages/common/FirstOrderCongratulations'
import RequestSentConfirmation from './pages/common/RequestSentConfirmation'
import ManualOrderRequestForm from './pages/common/ManualOrderRequestForm'
import CategorySelection from './pages/common/CategorySelection'
import ChooseOrderMethod from './pages/common/ChooseOrderMethod'
import FullOrderDetails from './pages/common/FullOrderDetails'
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
import AvailableSuppliers from './pages/common/AvailableSuppliers'
import AllSupplierOffers from './pages/common/AllSupplierOffers'
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
import RegistrationStep3ForDealers from './pages/onboarding/RegistrationStep3ForDealers'

// Product
import ProductCertificateUpload from './pages/product/ProductCertificateUpload'

// Offer
import OfferDeclineConfirmation from './pages/offer/OfferDeclineConfirmation'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Buyer Routes */}
        <Route path="/buyer" element={
          <BuyerLayout>
            <BuyerHomeScreen1 />
          </BuyerLayout>
        } />
        <Route path="/buyer/home-2" element={
          <BuyerLayout>
            <BuyerHomeScreen2 />
          </BuyerLayout>
        } />
        <Route path="/buyer/home-3" element={
          <BuyerLayout>
            <BuyerHomeScreen3 />
          </BuyerLayout>
        } />
        <Route path="/buyer/home-4" element={
          <BuyerLayout>
            <BuyerHomeScreen4 />
          </BuyerLayout>
        } />
        <Route path="/buyer/registration" element={
          <BuyerLayout>
            <BuyerRegistration />
          </BuyerLayout>
        } />
        <Route path="/buyer/dashboard-1" element={
          <BuyerLayout>
            <BuyerDashboard1 />
          </BuyerLayout>
        } />
        <Route path="/buyer/dashboard-2" element={
          <BuyerLayout>
            <BuyerDashboard2 />
          </BuyerLayout>
        } />
        <Route path="/buyer/offers" element={
          <BuyerLayout>
            <BuyerOffers />
          </BuyerLayout>
        } />
        <Route path="/buyer/offers-received" element={
          <BuyerLayout>
            <BuyerHomeOffersReceived />
          </BuyerLayout>
        } />

        {/* Seller Routes */}
        <Route path="/seller" element={
          <Layout>
            <SellerHomeScreen1 />
          </Layout>
        } />
        <Route path="/seller/home-2" element={
          <Layout>
            <SellerHomeScreen2 />
          </Layout>
        } />
        <Route path="/seller/home-3" element={
          <Layout>
            <SellerHomeScreen3 />
          </Layout>
        } />
        <Route path="/seller/welcome" element={
          <Layout>
            <SellerWelcome />
          </Layout>
        } />
        <Route path="/seller/profile-1" element={
          <Layout>
            <SellerProfileDetails1 />
          </Layout>
        } />
        <Route path="/seller/profile-2" element={
          <Layout>
            <SellerProfileDetails2 />
          </Layout>
        } />
        <Route path="/seller/profile-3" element={
          <Layout>
            <SellerProfileDetails3 />
          </Layout>
        } />
        <Route path="/seller/analytics-summary" element={
          <Layout>
            <SellerAnalyticsSummary />
          </Layout>
        } />
        <Route path="/seller/analytics-deep-dive-1" element={
          <Layout>
            <SellerAnalyticsDeepDive1 />
          </Layout>
        } />
        <Route path="/seller/analytics-deep-dive-2" element={
          <Layout>
            <SellerAnalyticsDeepDive2 />
          </Layout>
        } />
        <Route path="/seller/edit-profile" element={
          <Layout>
            <SellerEditProfile />
          </Layout>
        } />
        <Route path="/seller/settings" element={
          <Layout>
            <SellerSettingsPanel />
          </Layout>
        } />
        <Route path="/seller/add-product" element={
          <Layout>
            <SupplierAddProduct />
          </Layout>
        } />
        <Route path="/seller/my-requests" element={
          <Layout>
            <SupplierMyRequests />
          </Layout>
        } />
        <Route path="/seller/acceptance" element={
          <Layout>
            <SupplierAcceptance />
          </Layout>
        } />
        <Route path="/seller/role-selection" element={
          <Layout>
            <SupplierRoleSelection />
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
        <Route path="/confirm-delivery" element={
          <Layout>
            <ConfirmDelivery />
          </Layout>
        } />
        <Route path="/delivery-feedback" element={
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
        <Route path="/request-sent-confirmation" element={
          <Layout>
            <RequestSentConfirmation />
          </Layout>
        } />
        <Route path="/manual-order-request-form" element={
          <Layout>
            <ManualOrderRequestForm />
          </Layout>
        } />
        <Route path="/category-selection" element={
          <Layout>
            <CategorySelection />
          </Layout>
        } />
        <Route path="/choose-order-method" element={
          <Layout>
            <ChooseOrderMethod />
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
        <Route path="/available-suppliers" element={
          <Layout>
            <AvailableSuppliers />
          </Layout>
        } />
        <Route path="/all-supplier-offers" element={
          <Layout>
            <AllSupplierOffers />
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

        {/* Onboarding Routes */}
        <Route path="/onboarding/welcome-1" element={
          <Layout>
            <OnboardingWelcome1 />
          </Layout>
        } />
        <Route path="/onboarding/welcome-2" element={
          <Layout>
            <OnboardingWelcome2 />
          </Layout>
        } />
        <Route path="/registration/step-1" element={
          <Layout>
            <RegistrationStep1PhoneVerification />
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

        {/* Default route */}
        <Route path="/" element={
          <BuyerLayout>
            <BuyerHomeScreen1 />
          </BuyerLayout>
        } />
      </Routes>
    </Router>
  )
}

export default App
