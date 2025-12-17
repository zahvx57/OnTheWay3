import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { FaHome, FaUserAlt, FaSignOutAlt } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";

import { toggleTheme } from "../features/ThemeSlice";
import { logout } from "../features/UserSlice";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users?.user);
  const adminFlag = user?.adminFlag;

  const themeMode = useSelector((state) => state.theme?.mode || "light");
  const isDark = themeMode === "dark";

  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    dispatch(logout());
    navigate("/home", { replace: true });
  };

  
  const navLinkClass = ({ isActive }) =>
    `nav-link base-link ${isDark ? "dark-link" : "light-link"} ${
      isActive ? "active-blue" : ""
    }`;

  return (
    <>
      <Navbar
        expand="md"
        className={`navigation ${isDark ? "nav-dark" : "nav-light"}`}
      >
        
        <NavbarBrand className="d-flex align-items-center">
          <img
            src={user?.profilepic || "https://via.placeholder.com/60"}
            alt="profile"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "12px",
              border: isDark ? "2px solid #444" : "2px solid #ddd",
            }}
          />

          <div>
            <div style={{ fontSize: "0.85rem", color: isDark ? "#aaa" : "#666" }}>
              Welcome,
            </div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: isDark ? "#fff" : "#111",
              }}
            >
              {user?.uname || "User"}
            </div>
          </div>
        </NavbarBrand>

        
        <div className="d-flex align-items-center ms-auto">
          <button
            className="theme-btn"
            onClick={() => dispatch(toggleTheme())}
            type="button"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <NavbarToggler onClick={toggle} />
        </div>

        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
           
            <NavItem className="navs">
              <NavLink to="/home" className={navLinkClass}>
                <FaHome /> Home
              </NavLink>
            </NavItem>

            {adminFlag !== "Y" && (
              <NavItem className="navs">
                <NavLink to="/favorite" className={navLinkClass}>
                  <AiFillHeart /> Favorite
                </NavLink>
              </NavItem>
            )}

        
            
            {adminFlag === "Y" && (
              <NavItem className="navs">
                <NavLink to="/admin" className={navLinkClass}>
                  <MdAdminPanelSettings /> Admin
                </NavLink>
              </NavItem>
            )}

             
            <NavItem className="navs">
              <NavLink to="/profile" className={navLinkClass}>
                <FaUserAlt /> Profile
              </NavLink>
            </NavItem>

           
            <NavItem className="navs">
              <span
                className={`nav-link base-link ${
                  isDark ? "dark-link" : "light-link"
                }`}
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </span>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>

      {/* 🎨 CSS */}
      <style jsx="true">{`
        .nav-light {
          background: #ffffff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .nav-dark {
          background: #121212;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .base-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.95rem;
          text-decoration: none;
          transition: 0.2s ease;
        }

        .light-link {
          color: #000000 !important;
        }

        .dark-link {
          color: #ffffff !important;
        }

        .base-link:hover {
          color: #0d6efd !important;
        }

        .active-blue {
          color: #0d6efd !important;
          font-weight: 600;
        }

        .theme-btn {
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          margin-right: 10px;
        }
      `}</style>
    </>
  );
};

export default Header;
