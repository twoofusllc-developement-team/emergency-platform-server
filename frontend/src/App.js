import './App.css';
import Services from './components/Services/Services';
import Header from './components/Header/Header';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Booking from './pages/Booking';
import Signup from './pages/signup/Signup.component'
import Signin from './pages/signin/Signin.component'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './components/ui/toast/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotFound from "./pages/notFound/notFound";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <ToastProvider>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <div className="App">
                <Routes>
                  <Route index element={
                    <div>
                      <Header></Header>
                      <Contact></Contact>
                      <Services></Services>
                      <Footer></Footer>
                    </div>
                  }></Route>
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/auth/signup" element={<Signup/>} />
                  <Route path="/auth/login" element={<Signin/>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </QueryClientProvider>
        </HelmetProvider>
      </ToastProvider>
    </>
  );
}

export default App;
