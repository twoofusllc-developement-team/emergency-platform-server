import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Header.css";
function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Container className='navbar-center-content'>
        <Navbar.Brand href="#home">
            <img
                src="/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Logo"
            />
        </Navbar.Brand>
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"> */}
          <Nav className="max-auto " >
            <Nav.Link href="#">Location</Nav.Link>
            {/* <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>
          <div>
            <Button variant="outline-primary">English</Button>
            <Button variant="outline-primary">Arabic</Button>
          </div>
          
        {/* </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
}

export default Header;