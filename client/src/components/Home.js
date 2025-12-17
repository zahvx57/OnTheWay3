import { useEffect, useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Button,
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import Logo from "../assets/logo.png";

const makeShort = (name = "") => {
  if (!name) return "";
  const words = name.trim().split(" ");
  const letters = words.map((w) => w[0].toUpperCase()).join("");
  return letters.slice(0, 5);
};

const colorPalette = [
  "#f66",
  "#69f",
  "#93f",
  "#7c5",
  "#c5a",
  "#f90",
  "#0af",
  "#0a7",
  "#8b4",
  "#8844ff",
  "#dd4477",
  "#11aabb",
  "#bb4455",
  "#22cc88",
  "#3399ff",
  "#cc9955",
  "#5566ee",
  "#33aa44",
  "#dd6633",
  "#cc33aa",
  "#44bbdd",
  "#ff5577",
  "#66aaff",
  "#22bbcc",
];

const Home = () => {
  const user = useSelector((state) => state.users?.user);
  const email = user?.email;
  const adminFlag = user?.adminFlag;

  const themeMode = useSelector((state) => state.theme?.mode) || "light";
  const isDark = themeMode === "dark";

  const navigate = useNavigate();

  const isAdmin = adminFlag === "Y";

  const [searchText, setSearchText] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editPlaceName, setEditPlaceName] = useState("");
  const [editPlaceCity, setEditPlaceCity] = useState("");

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("http://localhost:5000/places");
        const data = await res.json();
        setPlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const handlePlaceClick = (placeId) => {
    navigate(`/place/${placeId}`);
  };

  const handleStartEdit = (place) => {
    setEditingPlaceId(place._id);
    setEditPlaceName(place.name || "");
    setEditPlaceCity(place.city || "");
  };

  const handleCancelEdit = () => {
    setEditingPlaceId(null);
    setEditPlaceName("");
    setEditPlaceCity("");
  };

  const handleSaveEdit = async () => {
    if (!editPlaceName.trim()) {
      showMessage("Place name is required.");
      return;
    }
    if (!editingPlaceId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/place/${editingPlaceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: editPlaceName,
            city: editPlaceCity,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to update place.");
      } else {
        setPlaces((prev) =>
          prev.map((p) =>
            p._id === editingPlaceId
              ? data.place || {
                  ...p,
                  name: editPlaceName,
                  city: editPlaceCity,
                }
              : p
          )
        );
        showMessage("Place updated successfully.");
        handleCancelEdit();
      }
    } catch (err) {
      showMessage("Server error while updating place.");
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/place/${placeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to delete place.");
      } else {
        setPlaces((prev) => prev.filter((p) => p._id !== placeId));
        if (editingPlaceId === placeId) handleCancelEdit();
        showMessage("Place deleted successfully.");
      }
    } catch (err) {
      showMessage("Server error while deleting place.");
    }
  };

  const filteredPlaces = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return places.filter((place) => {
      if (q === "") return true;
      const name = place.name?.toLowerCase() || "";
      const short = makeShort(place.name).toLowerCase();
      return name.startsWith(q) || short.startsWith(q);
    });
  }, [places, searchText]);

  const searchTextColor = isDark ? "#ffffff" : "#0b0f17";
  const searchPlaceholderColor = isDark
    ? "rgba(255,255,255,0.45)"
    : "rgba(0,0,0,0.45)";

  const pageBg = isDark ? "#0f1115" : "#f4f6fb";
  const surface = isDark ? "#151922" : "#ffffff";
  const surface2 = isDark ? "#111520" : "#fbfcff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(10,25,41,0.10)";
  const textMain = isDark ? "#ffffff" : "#0b0f17";
  const textSub = isDark ? "rgba(255,255,255,0.65)" : "rgba(11,15,23,0.60)";
  const shadow = isDark
    ? "0 16px 40px rgba(0,0,0,0.35)"
    : "0 16px 40px rgba(10,25,41,0.08)";

  const primary = "#2F80FF";
  const primarySoft = isDark
    ? "rgba(47,128,255,0.18)"
    : "rgba(47,128,255,0.12)";

  const searchBg = isDark ? "#0f1420" : "#ffffff";
  const searchBorder = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(11,15,23,0.12)";

  const pageStyle = {
    minHeight: "100vh",
    background: pageBg,
    paddingBottom: "28px",
    transition: "0.2s ease",
  };

  const headerCard = {
    background: `linear-gradient(135deg, ${surface} 0%, ${surface2} 100%)`,
    border: `1px solid ${border}`,
    borderRadius: "18px",
    padding: "18px",
    boxShadow: shadow,
  };

  const adminBanner = {
    marginTop: "14px",
    background: primarySoft,
    border: `1px solid ${
      isDark ? "rgba(47,128,255,0.35)" : "rgba(47,128,255,0.25)"
    }`,
    borderRadius: "14px",
    padding: "10px 12px",
    color: textMain,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "space-between",
  };

  const messageStyle = {
    backgroundColor: isDark ? "rgba(47,128,255,0.12)" : "#e7f4ff",
    border: isDark ? "1px solid rgba(47,128,255,0.25)" : "1px solid #bcdcff",
    color: isDark ? "#beddff" : "#0057b7",
    padding: "10px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: 600,
  };

  const listCard = {
    background: surface,
    border: `1px solid ${border}`,
    borderRadius: "18px",
    boxShadow: shadow,
    overflow: "hidden",
  };

  const listHead = {
    padding: "14px 14px 10px 14px",
    borderBottom: `1px solid ${border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
  };

  const pill = (bg, txt, b) => ({
    background: bg,
    color: txt,
    border: `1px solid ${b}`,
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "0.8rem",
    fontWeight: 700,
  });

  const itemStyle = {
    padding: "14px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    borderBottom: `1px solid ${border}`,
    cursor: "pointer",
    transition: "0.18s ease",
  };

  const iconStyle = (color) => ({
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: color,
    color: "#fff",
    fontWeight: 900,
    letterSpacing: "0.6px",
    flexShrink: 0,
    boxShadow: "0 10px 18px rgba(0,0,0,0.10)",
  });

  const placeNameStyle = {
    color: textMain,
    fontWeight: 800,
    fontSize: "1rem",
  };

  const placeCityStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.85rem",
    color: textSub,
    marginTop: "4px",
  };

  const actionsWrap = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  };

  const btnBase = {
    borderRadius: "12px",
    fontWeight: 800,
    padding: "8px 10px",
  };

  const editBoxStyle = {
    borderTop: `1px dashed ${border}`,
    background: isDark ? "#0e1320" : "#f7f9ff",
    padding: "14px",
  };

  const labelStyle = {
    fontSize: "0.85rem",
    marginBottom: "4px",
    color: isDark ? "rgba(255,255,255,0.78)" : "rgba(11,15,23,0.75)",
    fontWeight: 700,
  };

  const inputStyle = {
    backgroundColor: searchBg,
    color: searchTextColor,
    borderColor: searchBorder,
    caretColor: searchTextColor,
    borderRadius: "12px",
    padding: "10px 12px",
  };

  const emptyStyle = {
    textAlign: "center",
    padding: "22px 14px",
    color: textSub,
    fontWeight: 700,
  };

  return (
    <div className="ontheway-page" style={pageStyle}>
      <style>{`
        .home-search-input::placeholder { color: ${searchPlaceholderColor} !important; }
        .place-row:hover { transform: translateY(-1px); background: ${
          isDark ? "rgba(255,255,255,0.03)" : "rgba(47,128,255,0.04)"
        }; }
        .place-row:active { transform: translateY(0px); }
      `}</style>

      <Container style={{ paddingTop: "16px", paddingLeft: "16px" }}>
        <Row className="justify-content-start">
          <Col md="12">
            <div style={headerCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "14px",
                }}
              >
                <img src={Logo} alt="OnTheWay" style={{ height: "64px" }} />

                <div>
                  <h2
                    style={{
                      color: textMain,
                      margin: 0,
                      fontWeight: 900,
                      fontSize: "1.8rem",
                      lineHeight: 1.1,
                    }}
                  >
                    OnTheWay
                  </h2>

                  <p
                    style={{
                      color: textSub,
                      margin: "4px 0 0 0",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {isAdmin
                      ? "Admin view: edit and delete places directly from here."
                      : "Browse places and choose the best one for your needs."}
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div style={adminBanner}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: "rgba(47,128,255,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${
                          isDark
                            ? "rgba(47,128,255,0.35)"
                            : "rgba(47,128,255,0.25)"
                        }`,
                      }}
                    >
                      <MdAdminPanelSettings
                        color={isDark ? "#beddff" : "#1c5dff"}
                        size={18}
                      />
                    </div>

                    <div>
                      <div style={{ color: textMain, fontWeight: 900 }}>
                        Admin Controls Enabled
                      </div>
                      <div
                        style={{
                          color: textSub,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        You can edit / delete places (buttons inside each card).
                      </div>
                    </div>
                  </div>

                  <div
                    style={pill(
                      primarySoft,
                      textMain,
                      isDark
                        ? "rgba(47,128,255,0.35)"
                        : "rgba(47,128,255,0.25)"
                    )}
                  >
                    ADMIN
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {message && (
          <Row className="justify-content-center mt-3">
            <Col md="10" lg="8">
              <div style={messageStyle}>{message}</div>
            </Col>
          </Row>
        )}

        <Row className="justify-content-center mt-3">
          <Col md="10" lg="8">
            <div style={listCard}>
              <div style={listHead}>
                <div>
                  <div
                    style={{
                      color: textMain,
                      fontWeight: 900,
                      fontSize: "1.05rem",
                    }}
                  >
                    Places
                  </div>
                  <div
                    style={{
                      color: textSub,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {loading
                      ? "Loading..."
                      : `${filteredPlaces.length} result${
                          filteredPlaces.length === 1 ? "" : "s"
                        }`}
                  </div>
                </div>
              </div>

              <div style={{ padding: "14px" }}>
                <InputGroup>
                  <Input
                    className="home-search-input"
                    placeholder="Search for a place (name or short letters)"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={inputStyle}
                  />
                  <InputGroupText
                    style={{
                      backgroundColor: searchBg,
                      color: searchTextColor,
                      borderColor: searchBorder,
                      borderRadius: "12px",
                      marginLeft: "8px",
                      padding: "10px 12px",
                    }}
                  >
                    <FiSearch />
                  </InputGroupText>
                </InputGroup>
              </div>

              {loading ? (
                <div style={emptyStyle}>Loading places...</div>
              ) : filteredPlaces.length === 0 ? (
                <div style={emptyStyle}>No places found...</div>
              ) : (
                filteredPlaces.map((place, index) => {
                  const short = makeShort(place.name);
                  const color = colorPalette[index % colorPalette.length];
                  const isEditing = editingPlaceId === place._id;

                  return (
                    <div key={place._id}>
                      <div
                        className="place-row"
                        style={itemStyle}
                        onClick={() => handlePlaceClick(place._id)}
                      >
                        <div style={iconStyle(color)}>
                          <span>{short}</span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={placeNameStyle}>{place.name}</div>

                          {place.city && (
                            <div style={placeCityStyle}>
                              <FaMapMarkerAlt size={12} />
                              <span>{place.city}</span>
                            </div>
                          )}

                          {isAdmin && (
                            <div style={actionsWrap}>
                              <Button
                                size="sm"
                                color="warning"
                                style={btnBase}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(place);
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                size="sm"
                                color="danger"
                                style={btnBase}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePlace(place._id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            color: isDark
                              ? "rgba(255,255,255,0.35)"
                              : "rgba(11,15,23,0.30)",
                            fontWeight: 900,
                            paddingTop: "4px",
                          }}
                        >
                          →
                        </div>
                      </div>

                      {isAdmin && isEditing && (
                        <div style={editBoxStyle}>
                          <Row>
                            <Col md="6" className="mb-2">
                              <label style={labelStyle}>Place Name</label>
                              <Input
                                value={editPlaceName}
                                onChange={(e) =>
                                  setEditPlaceName(e.target.value)
                                }
                                style={inputStyle}
                              />
                            </Col>

                            <Col md="6" className="mb-2">
                              <label style={labelStyle}>
                                City / Description
                              </label>
                              <Input
                                value={editPlaceCity}
                                onChange={(e) =>
                                  setEditPlaceCity(e.target.value)
                                }
                                style={inputStyle}
                              />
                            </Col>
                          </Row>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <Button
                              size="sm"
                              color="primary"
                              style={{
                                ...btnBase,
                                backgroundColor: primary,
                                borderColor: primary,
                              }}
                              onClick={handleSaveEdit}
                            >
                              Save
                            </Button>

                            <Button
                              size="sm"
                              color="secondary"
                              style={btnBase}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
