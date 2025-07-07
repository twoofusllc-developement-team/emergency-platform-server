
import Service from "./Service";
import './Services.css';
import Booking from "../../pages/Booking";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
function Services(){

const imgs = [
  { id: 1, url: require("./../../assets/Services/Add Shelter.png") },
  { id: 2, url: require("./../../assets/Services/Donate Blood.png") },
  { id: 3, url: require("./../../assets/Services/Emergency.png") },
  { id: 4, url: require("./../../assets/Services/Mobility.png") },
  { id: 5, url: require("./../../assets/Services/Request Blood.png") },
  { id: 6, url: require("./../../assets/Services/Donation.png") }
];
    return(
            <Container className="my-5">
      <h2 className="text-center mb-4">Choose your Emergency Service</h2>
      <Row xs={1} sm={2} lg={3} className="g-4">
        {imgs.map((service) => (
          <Col key={service.id}>
            
            <Service 
              src={service.url} 
              title={service.title}
            />
            
          </Col>
        ))}
      </Row>
    </Container>
    )
}
export default Services;