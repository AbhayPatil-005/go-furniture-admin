import { Navbar, Container } from "react-bootstrap";
import { useSelector } from "react-redux";


const DashboardHeader = () => {
    const adminEmail = useSelector((state) => state.auth.adminEmail);    

    return (
        <Navbar bg="light" className="shadow-sm px-3">
            <Container fluid>
                <Navbar.Brand className="fw-bold text-dark">
                    🛠 GoFurniture Admin
                </Navbar.Brand>
                <div className="text-muted small">
                    Logged in as <strong>{adminEmail}</strong>
                </div>
                
            </Container>
        </Navbar>
    );
};

export default DashboardHeader;