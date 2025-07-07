import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Contact.css"
function Contact() {
  return (
    <Container 
      fluid 
      className="position-relative p-5" 
      style={{
        backgroundColor: '#144D29',
        color: 'white',
        minHeight: '200px'
      }}
    >
     
      <div className="pb-5">
   
      </div>
      
      
      <div className="position-absolute start-0 bottom-0 p-3 d-flex gap-3">
        <Button 
          variant="light" 
          className="text-144D29 bg-EED5AB border-0 px-4 py-2 fw-bold"
        >
          Request Ambulance
        </Button>
        
        <Button 
          variant="light" 
          className="text-144D29 bg-EED5AB border-0 px-4 py-2 fw-bold"
        >
          Contact Us
        </Button>
      </div>
    </Container>
  );
}


export default Contact;