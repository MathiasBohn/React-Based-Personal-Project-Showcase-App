import { NavLink } from "react-router-dom";

export default function NavBar() {
  const getLinkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <nav className="nav nav-three">
      <div className="nav-left">
        <NavLink to="/" className={getLinkClass}>Home</NavLink>
      </div>
      <div className="nav-center">
        <NavLink to="/products" className={getLinkClass}>Shop</NavLink>
      </div>
      <div className="nav-right">
        <NavLink to="/admin/new" className={getLinkClass}>Admin Portal</NavLink>
      </div>
    </nav>
  );
}