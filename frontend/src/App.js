import logo from './logo.svg';
import './App.css';
import Services from './components/Services/Services';
import Header from './components/Header/Header';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Booking from './pages/Booking';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
//  
  return (
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
        
      </Routes>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
    </Router>
  );
}

export default App;
