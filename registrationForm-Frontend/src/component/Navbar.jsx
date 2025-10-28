// File: Navbar.jsx located in root-directory/src/component/
import { Link } from "react-router-dom";
 
function Navbar() {
  return (
    <div>
      <nav>
        <Link to="/" style={{marginRight: "5px"}}>Home</Link>
        <Link to="/register" style={{marginRight: "5px"}}>Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
    </div>
  );
}
 
export default Navbar;