// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Row, Col, Button, Container } from 'react-bootstrap';
import ShelterCard from '../ShelterCard/ShelterCard';
function FetchShelters() {
    const shelters = [{
  id: "111",         
  image: "",     
  location: "location",   
  capacity: "5",   
  available: "true", 
  phone: "+159258",     
  whatsapp: "+45225"    
},
{
  id: "211",         
  image: "",     
  location: "location",   
  capacity: "5",   
  available: "true", 
  phone: "+159258",     
  whatsapp: "+45225"    
}];
const available = "Available Shelters ("+shelters.length+")";
    return(
       <Container>
        <h4>{available}</h4>
            {
                shelters.map(
                    (shelter) => (
                        <ShelterCard shelter={shelter}></ShelterCard>
                    )
                )
            }
       </Container>
    );
}
export default FetchShelters;