import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Favorite from "./components/Favorite";
import Profile from "./components/Profile";
import PlaceDetails from "./components/PlaceDetails";
import Order from "./components/Order";
import Admin from "./components/Admin";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const email = useSelector((state) => state.users?.user?.email);
  const themeMode = useSelector((state) => state.theme?.mode) || "light";

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(themeMode === "dark" ? "dark-mode" : "light-mode");
  }, [themeMode]);

  return (
    <Container fluid className="p-0">
      <Router>
        {/* Header */}
        {email ? (
          <Row className="m-0">
            <Col className="p-0">
              <Header />
            </Col>
          </Row>
        ) : null}

        {/* Pages */}
        <Row className="m-0">
          <Col className="p-0">
            <Routes>
              {/* Public */}
              <Route path="/" element={email ? <Navigate to="/home" replace /> : <Login />} />
              <Route path="/register" element={email ? <Navigate to="/home" replace /> : <Register />} />

              {/* Protected */}
              <Route path="/home" element={email ? <Home /> : <Navigate to="/" replace />} />
              <Route path="/favorite" element={email ? <Favorite /> : <Navigate to="/" replace />} />
              <Route path="/profile" element={email ? <Profile /> : <Navigate to="/" replace />} />
              <Route path="/place/:id" element={email ? <PlaceDetails /> : <Navigate to="/" replace />} />
              <Route path="/order" element={email ? <Order /> : <Navigate to="/" replace />} />
              <Route path="/admin" element={email ? <Admin /> : <Navigate to="/" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to={email ? "/home" : "/"} replace />} />
            </Routes>
          </Col>
        </Row>

        {/* Footer */}
        {email ? (
          <Row className="m-0">
            <Col className="p-0">
              <Footer />
            </Col>
          </Row>
        ) : null}
      </Router>
    </Container>
  );
}

export default App;
