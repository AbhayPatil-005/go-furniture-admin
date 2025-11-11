import SideBar from "./SideBar";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { logout } from "../../reduxStore/authSlice";



const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/admin-login");
    };

    return (<>
        <Container fluid className="p-0 vh-100">
            <DashboardHeader />
            <Row className="h-100 g-0">
                <Col xs={12} md={3} lg={2} className="bg-dark text-white p-3 d-flex flex-column ">
                    <SideBar />

                    <Button variant="outline-danger" className="w-100 mt-auto" onClick={handleLogout}>
                        Logout
                    </Button>
                </Col>

                <Col xs={12} md={9} lg={10} className="p-4 bg-light">
                    <Outlet />
                </Col>
            </Row>
        </Container>

    </>)
}

export default HomePage;