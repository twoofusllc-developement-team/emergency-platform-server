import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./NavServices.css"
function NavServices(){
    return(
        <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" style={{ backgroundColor: '#EED5AB' }} />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mx-auto my-2 my-lg-0" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Nav.Link href="#add-shelter" className="nav-link-custom">Add Shelter</Nav.Link>
            <Nav.Link href="#book-shelter" className="nav-link-custom">Book Shelter</Nav.Link>
            <Nav.Link href="#emergency-org" className="nav-link-custom">Emergency Organization</Nav.Link>
            <Nav.Link href="#mobility" className="nav-link-custom">Mobility</Nav.Link>
            <Nav.Link href="#donation" className="nav-link-custom">Donation</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}
export default NavServices;