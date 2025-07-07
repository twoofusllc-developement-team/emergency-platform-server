
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
function ShelterCard({shelter}){
    return(<Card className="mb-4 shadow-sm" style={{ borderRadius: '10px' }}>
        
          <Row className="g-0">
        
        <Col md={2} style={{ background: '#f8f9fa' }}>
          <Card.Img
            src={shelter.image || 'https://via.placeholder.com/150'}
            alt="Shelter"
            className="img-fluid h-100"
            style={{ objectFit: 'cover', borderRadius: '10px 0 0 10px' }}
          />
        </Col>
                <Col md={10}>
          <Card.Body>
            <Row>
             
              <Col md={12} className="mb-2">
                <Card.Title style={{ color: '#144D29' }}>
                  Shelter ID: <span className="text-muted">{shelter.id}</span>
                </Card.Title>
              </Col>

              
              <Col md={12} className="mb-3">
                <Card.Text>
                  <strong>Location:</strong> {shelter.location}<br />
                  <strong>Capacity:</strong> {shelter.capacity}<br />
                  <strong>Status:</strong> <span style={{ color: shelter.available ? 'green' : 'red' }}>
                    {shelter.available ? 'Available' : 'Full'}
                  </span>
                </Card.Text>
              </Col>

              
              <Col md={12}>
                <div className="d-flex gap-2 ">
                  <Button 
                    variant="outline-primary" 
                    className="d-flex align-items-center gap-1"
                    onClick=""
                  >
                    <FaPhone /> Call
                  </Button>
                  <Button 
                    variant="outline-success" 
                    className="d-flex align-items-center gap-1"
                    onClick=""
                  >
                    <FaWhatsapp /> WhatsApp
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Col>

        </Row>
    </Card>);
}
export default ShelterCard;