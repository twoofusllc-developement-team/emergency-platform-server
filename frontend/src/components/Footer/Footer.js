import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer(){
      
  const footerStyle = {
    backgroundColor: '#EED5AB',
    color: '#144D29',
    padding: '2rem 0'
  };

  const buttonStyle = {
    backgroundColor: '#144D29',
    borderColor: '#144D29',
    color: '#EED5AB'
  };

  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#144D29'
  };
    return(
    <footer style={footerStyle} className="py-5 mt-5">
      <Container>
        <Row>
          {/* Contact Information Column */}
          <Col md={6} className="mb-4 mb-md-0">
            <h5 style={{ color: '#144D29' }}>Contact Information</h5>
            <div className="mt-3">
              <p>
                <i className="bi bi-telephone me-2" style={{ color: '#144D29' }}></i>
                Contact Number: +961 XX XXX XXX
              </p>
              <p>
                <i className="bi bi-envelope me-2" style={{ color: '#144D29' }}></i>
                Email: info@example.com
              </p>
            </div>
          </Col>

          {/* Form Column */}
          <Col md={6}>
            <h5 style={{ color: '#144D29' }}>Contact Us</h5>
            <Form onSubmit="">
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label style={{ color: '#144D29' }}>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter your name" 
                  required 
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label style={{ color: '#144D29' }}>Email address</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  style={inputStyle}
                />
              </Form.Group>

              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label style={{ color: '#144D29' }}>Message</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Your message" 
                  required 
                  style={inputStyle}
                />
              </Form.Group>

              <Button variant="primary" type="submit" style={buttonStyle}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </footer>
    )
}

export default Footer;