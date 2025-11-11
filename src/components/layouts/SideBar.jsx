import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const SideBar =()=>{
    return(<>
            <Nav className="flex-column">
        <NavLink
          to="/home/products"
          className="nav-link text-white mb-2"
          activeclassname="fw-bold text-warning"
        >
          📦 Products
        </NavLink>
        <NavLink
          to="/home/orders"
          className="nav-link text-white mb-2"
          activeclassname="fw-bold text-warning"
        >
          📋 Orders
        </NavLink>
      </Nav>
    </>)
}

export default SideBar;