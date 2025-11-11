import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const SideBar = () => {
    return (<>
        <Nav className="flex-column">
            <NavLink
                to="/home/products"
                className={({ isActive }) => `nav-link mb-2 ${isActive ? "fw-bold text-info" : "text-white"}`}
            >
                📦 Products
            </NavLink>
            <NavLink
                to="/home/add-product"
                className={({ isActive }) => `nav-link mb-2 ${isActive ? "fw-bold text-info" : "text-white"}`}

            >
                📦 Add Products
            </NavLink>
            <NavLink
                to="/home/orders"
                className={({ isActive }) => `nav-link mb-2 ${isActive ? "fw-bold text-info" : "text-white"}`}

            >
                📋 Orders
            </NavLink>
        </Nav>
    </>)
}

export default SideBar;