import {Link, NavLink, Outlet} from 'react-router-dom';


function Header(){
    return (
      <div className="navbar bg-base-100 mb-4">
        <div className="flex-1"><a className="btn btn-primary border-2 text-xl font-bold">Med Cars</a></div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/">Home</NavLink></li>
            <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/cars">Cars</NavLink></li>
            <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/clients">Clients</NavLink></li>
            <li><NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/contracts">Contracts</NavLink></li>
          </ul>
        </div>
      </div>
    )
}

export default Header;