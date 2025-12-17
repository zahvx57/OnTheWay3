import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const theme = useSelector((state) => state.theme?.mode || "light");

  const isDark = theme === "dark";

  return (
    <div
      className="footer"
      style={{
        backgroundColor: isDark ? "#000000" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.9rem",
        borderTop: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid #e5e7eb",
      }}
    >
      © 2025 OnTheWay. All rights reserved.
    </div>
  );
};

export default Footer;
