import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useAnimation } from "framer-motion";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut } from "lucide-react";

function Header() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();
  const [activeTab, setActiveTab] = useState("");
  const tab = useRef({});

  useEffect(() => {
    const path = location.pathname;
    setActiveTab(path);
    const activeTabElement = tab.current[path];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      controls.start({
        x: offsetLeft,
        width: offsetWidth,
        transition: { type: "spring", stiffness: 500, damping: 50 },
      });
    }
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("user_email");
    dispatch({ type: "UPDATE_USER", payload: null });
    message.open({
      className: "text-success",
      content: "logged out",
      duration: 2,
      icon: <FontAwesomeIcon className="mr-2" icon={faCheckCircle} />,
    });
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 mb-4">
      <div className="navbar-start">
        <Link className="btn btn-primary border-2 text-xl font-bold rounded-3xl" to="/">Med Cars</Link>
      </div>
      <div className="navbar-center flex">
        <ul className="menu menu-horizontal gap-3 px-0 py-1 mx-2 relative">
          <li ref={(e) => (tab.current["/search"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline w-22 btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/search">All Cars</NavLink></li>
          {user?.role === "admin" && (
            <>
              <li ref={(e) => (tab.current["/dashboard"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline w-22 btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/dashboard">Dashboard</NavLink></li>
              <li ref={(e) => (tab.current["/cars"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline w-22 btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/cars">Cars</NavLink></li>
              <li ref={(e) => (tab.current["/clients"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline w-22 btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/clients">Clients</NavLink></li>
              <li ref={(e) => (tab.current["/contracts"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline w-22 btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/contracts">Contracts</NavLink></li>
            </>
          )}
          {user && user.role !== "admin" && (
            <>
              <li ref={(e) => (tab.current["/my-contracts"] = e)}><NavLink className={({ isActive }) => `btn btn-sm transition-[border-radius] duration-500 rounded-2xl btn-outline btn-accent ${isActive ? "rounded-b-none font-bold text-base" : ""}`} to="/my-contracts">My Contracts</NavLink></li>
            </>
          )}
          {["/dashboard", "/cars", "/clients", "/contracts", "/my-contracts", "/search"].includes(location.pathname) && <motion.div className="absolute bottom-0 rounded-b-sm left-0 h-1 bg-accent/90" animate={controls} initial={{ x: 0 }} />}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <button className="btn btn-sm btn-outline btn-accent rounded-2xl mx-2" onClick={logout}>Logout<LogOut size={16} /></button>
        ) : (
          <NavLink className={({ isActive }) => `btn btn-sm btn-outline btn-accent transition-colors duration-500 rounded-2xl mx-2 ${isActive ? "btn-active font-bold text-base" : ""}`} to="/sign"><LogIn size={16} />Sign In</NavLink>
        )}
      </div>
    </div>
  );
}

export default Header;