import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import Logo from "../assets/logo.png";
import { fetchPlaces } from "../features/PlacesSlice";
import { addFavorite } from "../features/FavoriteSlice";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const places = useSelector((state) => state.places.places);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === "dark";

  const user = useSelector((state) => state.users?.user);
  const isAdmin = user?.adminFlag === "Y";
  const email = user?.email;

  const [searchText, setSearchText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const filteredPlaces = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return (places || []).filter((place) => {
      if (!q) return true;
      const name = place?.name?.toLowerCase() || "";
      const short = makeShort(place?.name).toLowerCase();
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
  const searchBg = isDark ? "#0f1420" : "#ffffff";
  const searchBorder = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(11,15,23,0.12)";

  const danger = "#EF4444";
  const warning = "#F59E0B";

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

  const descStyle = {
    color: textSub,
    marginTop: "6px",
    fontSize: "0.86rem",
    fontWeight: 600,
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

  const adminMsgStyle = {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${border}`,
    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(47,128,255,0.06)",
    color: textMain,
    fontWeight: 800,
    textAlign: "center",
  };

  const miniInputStyle = {
    width: "100%",
    backgroundColor: isDark ? "#0f1420" : "#ffffff",
    color: textMain,
    border: `1px solid ${searchBorder}`,
    borderRadius: "12px",
    padding: "8px 10px",
    outline: "none",
  };

  const adminBtn = (bg) => ({
    ...btnBase,
    backgroundColor: bg,
    borderColor: bg,
    color: "#fff",
  });

  const startEdit = (place) => {
    setEditingId(place._id);
    setEditName(place.name || "");
    setEditCity(place.city || "");
    setAdminMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCity("");
    setAdminMsg("");
  };

  const showAdminMsg = (txt) => {
    setAdminMsg(txt);
    setTimeout(() => setAdminMsg(""), 2500);
  };

  const saveEdit = async (placeId) => {
    if (!email) return showAdminMsg("Login required.");
    if (!editName.trim()) return showAdminMsg("Place name is required.");

    try {
      const res = await fetch(`https://ontheway10.onrender.com/admin/place/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: editName, city: editCity }),
      });
      const data = await res.json();
      if (!res.ok) return showAdminMsg(data.message || "Failed to update.");

      showAdminMsg("Updated successfully.");
      cancelEdit();
      dispatch(fetchPlaces());
    } catch (e) {
      showAdminMsg("Server error.");
    }
  };

  const deletePlace = async (placeId) => {
    if (!email) return showAdminMsg("Login required.");
    const ok = window.confirm("Delete this place?");
    if (!ok) return;

    try {
      const res = await fetch(`https://ontheway10.onrender.com/admin/place/${placeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return showAdminMsg(data.message || "Failed to delete.");

      showAdminMsg("Deleted successfully.");
      dispatch(fetchPlaces());
    } catch (e) {
      showAdminMsg("Server error.");
    }
  };

  return (
    <div style={pageStyle}>
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
                    Browse places and choose the best one for your needs.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col md="10" lg="8">
            <div style={listCard}>
              <div style={listHead}>
                <div>
                  <div style={{ color: textMain, fontWeight: 900, fontSize: "1.05rem" }}>
                    Places
                  </div>
                  <div style={{ color: textSub, fontWeight: 700, fontSize: "0.85rem" }}>
                    {(filteredPlaces || []).length} result{(filteredPlaces || []).length === 1 ? "" : "s"}
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

                {isAdmin && adminMsg && <div style={adminMsgStyle}>{adminMsg}</div>}
              </div>

              {!filteredPlaces || filteredPlaces.length === 0 ? (
                <div style={emptyStyle}>No places available</div>
              ) : (
                filteredPlaces.map((place, index) => {
                  const short = makeShort(place?.name);
                  const color = colorPalette[index % colorPalette.length];
                  const isEditing = editingId === place._id;

                  return (
                    <div key={place._id}>
                      <div
                        className="place-row"
                        style={itemStyle}
                        onClick={() => navigate(`/place/${place._id}`)}
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

                          {place.description && (
                            <div style={descStyle}>{place.description.slice(0, 90)}...</div>
                          )}

                          <div style={actionsWrap}>
                            <Button
                              size="sm"
                              color="primary"
                              style={{ ...btnBase, backgroundColor: primary, borderColor: primary }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/place/${place._id}`);
                              }}
                            >
                              View Details
                            </Button>

                            {!isAdmin && (
                              <Button
                                size="sm"
                                outline
                                color={isDark ? "light" : "dark"}
                                style={btnBase}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(addFavorite(place));
                                }}
                              >
                                ❤ Favorite
                              </Button>
                            )}

                            {isAdmin && (
                              <>
                                <Button
                                  size="sm"
                                  style={adminBtn(warning)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(place);
                                  }}
                                >
                                  Edit
                                </Button>

                                <Button
                                  size="sm"
                                  style={adminBtn(danger)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePlace(place._id);
                                  }}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>

                          {isAdmin && isEditing && (
                            <div style={{ marginTop: 12 }}>
                              <div style={{ display: "grid", gap: 10 }}>
                                <div>
                                  <div style={{ color: textSub, fontWeight: 800, fontSize: "0.82rem", marginBottom: 6 }}>
                                    Place Name
                                  </div>
                                  <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    style={miniInputStyle}
                                  />
                                </div>

                                <div>
                                  <div style={{ color: textSub, fontWeight: 800, fontSize: "0.82rem", marginBottom: 6 }}>
                                    City
                                  </div>
                                  <input
                                    value={editCity}
                                    onChange={(e) => setEditCity(e.target.value)}
                                    style={miniInputStyle}
                                  />
                                </div>

                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                  <Button
                                    size="sm"
                                    style={adminBtn(primary)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveEdit(place._id);
                                    }}
                                  >
                                    Save
                                  </Button>

                                  <Button
                                    size="sm"
                                    outline
                                    color={isDark ? "light" : "dark"}
                                    style={btnBase}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cancelEdit();
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            color: isDark ? "rgba(255,255,255,0.35)" : "rgba(11,15,23,0.30)",
                            fontWeight: 900,
                            paddingTop: "4px",
                          }}
                        >
                          →
                        </div>
                      </div>
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
