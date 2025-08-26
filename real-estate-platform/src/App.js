  import './App.css';
  import React, { useEffect, useState } from "react";
  import Loader from './components/loader/loader';
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import LoginPage from './pages/login_page';
  import SignupPage from './pages/signup_page';
  import HomePage from './pages/home_page';
  import BrowsePage from './pages/browes_page';
  import PropertyDetailPage from './pages/property-detail';
  import NotFoundPage from './pages/404_page';
  import MeetingRequestPage from './pages/meetingrequestpage';
  import ListPropertyPage from './pages/list-property_page';
  import ProfilePage from './pages/profile_page';
  import HelpPage from './pages/help_page';
  import AboutPage from './pages/about_page';
  import ContactPage from './pages/contact_page';
  import TermsPage from './pages/terms_page';
  import PrivacyPage from './pages/privacy_page';
  import Propertylist from './pages/property-type_page'
  import SearchResultsPage from './components/home/components/herosection/components/SearchResultsPage';
  import ForgotPasswordForm from './components/auth/login/components/ForgotPasswordForm';
  import ResetPasswordConfirmForm from './components/auth/login/components/ResetPasswordConfirmForm';
  import AddEventPlacePage from './pages/addeventplace_page';
  import EventPlaceDetailPageWrapper from './pages/eventplacedetail_page';
  import EventPlacePage from './pages/eventplace_page';
  import MyBookingsPage1 from './pages/mybookings';
  import { GoogleOAuthProvider } from '@react-oauth/google';


  function App() {
  const [loading, setLoading] = useState(true);

    useEffect(() => { 
      const timer = setTimeout(() => setLoading(false ), 2500);
      return () => clearTimeout(timer);
    }, []);
    

    return loading ? <Loader /> : (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <BrowserRouter>
        <div className="bg-[#0f1115] text-white">
        <Routes>
        
          <Route path="/browse" element={<BrowsePage/>} />
          {/* <Route path="/agents" element={<div>Find an Agent Page</div>} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/property-detail/:id" element={<PropertyDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/meeting-requests" element={<MeetingRequestPage />} />
          <Route path="/list-property" element={<ListPropertyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/terms" element={<TermsPage/>} />
          <Route path="/privacy" element={<PrivacyPage/>} />
          <Route path="/property-type" element={<Propertylist />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} /> 
          <Route path="/reset-password-confirm/:uidb64/:token" element={<ResetPasswordConfirmForm />} />
          <Route path="/add-event-place" element={<AddEventPlacePage />} />
          <Route path="/spaces/:id" element={<EventPlaceDetailPageWrapper />} />
          <Route path='/spaces' element={<EventPlacePage/>}/>
          <Route path='/My-Bookings' element={<MyBookingsPage1/>}/>
      
        </Routes>
        </div>
      </BrowserRouter>
      </GoogleOAuthProvider>


    );
  }

  export default App;
