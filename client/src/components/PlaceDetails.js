import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import { addFavorite } from "../features/FavoriteSlice";
import { setSelectedDelegate } from "../features/SelectedDelegateSlice";

const PlaceDetails = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.users?.user);
  const email = user?.email;
  const adminFlag = user?.adminFlag;

  const themeMode = useSelector((state) => state.theme?.mode) || "light";
  const isDark = themeMode === "dark";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [place, setPlace] = useState(null);
  const [delegates, setDelegates] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedDelegateId, setSelectedDelegateId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingDelegateId, setEditingDelegateId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editFee, setEditFee] = useState("");

  const [coords, setCoords] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const styles = useMemo(() => {
    const BG_DARK = "#121212";
    const CARD_DARK = "#2a2a2a";
    const PILL_DARK = "#3f3f3f";
    const BORDER_DARK = "1px solid rgba(255,255,255,0.12)";
    const TEXT_DARK = "#e5e7eb";
    const MUTED_DARK = "rgba(229,231,235,0.70)";

    const BG_LIGHT = "#f5f7fb";
    const CARD_LIGHT = "#ffffff";
    const PILL_LIGHT = "#f3f4f6";
    const BORDER_LIGHT = "1px solid #e6eaf2";
    const TEXT_LIGHT = "#111827";
    const MUTED_LIGHT = "#6b7280";

    const bg = isDark ? BG_DARK : BG_LIGHT;
    const cardBg = isDark ? CARD_DARK : CARD_LIGHT;
    const pillBg = isDark ? PILL_DARK : PILL_LIGHT;
    const border = isDark ? BORDER_DARK : BORDER_LIGHT;
    const text = isDark ? TEXT_DARK : TEXT_LIGHT;
    const muted = isDark ? MUTED_DARK : MUTED_LIGHT;

    const shadow = isDark
      ? "0 18px 40px rgba(0,0,0,0.60)"
      : "0 14px 30px rgba(0,0,0,0.10)";

    const linkColor = isDark ? "#9cc4ff" : "#0057b7";

    return {
      page: { minHeight: "100vh", background: bg, paddingBottom: 80, paddingTop: 14 },
      wrapper: { maxWidth: 980, marginTop: 14 },

      title: { color: text, fontWeight: 900, fontSize: "1.55rem", marginBottom: 6 },
      sub: { color: muted, marginBottom: 0, fontSize: "0.92rem" },
      link: { color: linkColor, textDecoration: "none", fontWeight: 800 },

      messageBox: {
        background: pillBg,
        border,
        color: text,
        padding: "12px 14px",
        borderRadius: 14,
        textAlign: "center",
        fontWeight: 900,
        boxShadow: isDark
          ? "0 10px 25px rgba(0,0,0,0.45)"
          : "0 10px 20px rgba(0,0,0,0.06)",
      },

      card: { background: cardBg, border, borderRadius: 16, boxShadow: shadow },
      selectedCard: { border: "2px solid rgba(255,255,255,0.25)" },

      name: { color: text, fontWeight: 900, marginBottom: 6 },
      meta: { color: muted, fontWeight: 600, marginBottom: 6 },
      fee: { color: text, fontWeight: 900, marginBottom: 10 },

      badgeLowest: {
        background: pillBg,
        border,
        color: text,
        padding: "4px 10px",
        borderRadius: 999,
        fontWeight: 900,
        fontSize: "0.8rem",
        display: "inline-block",
        marginBottom: 10,
      },

      btnPrimary: {
        background: isDark ? "#3f3f3f" : "#111827",
        color: isDark ? TEXT_DARK : "#ffffff",
        border,
        borderRadius: 12,
        padding: "9px 12px",
        fontWeight: 900,
      },
      btnSecondary: {
        background: isDark ? "#2f2f2f" : "#ffffff",
        color: text,
        border,
        borderRadius: 12,
        padding: "9px 12px",
        fontWeight: 900,
      },

      locBox: { marginTop: 8, fontSize: "0.86rem", color: muted, textAlign: "right" },
      error: { marginTop: 8, fontSize: "0.86rem", color: "#ff6b6b", fontWeight: 800 },

      miniLabel: { color: muted, fontSize: "0.82rem", marginBottom: 4, fontWeight: 800 },
      miniInput: {
        width: "100%",
        background: isDark ? "#1b1b1b" : "#ffffff",
        color: text,
        border,
        borderRadius: 10,
        padding: "8px 10px",
        outline: "none",
      },
      divider: { height: 1, background: isDark ? "rgba(255,255,255,0.10)" : "#eef2f7", margin: "12px 0" },
    };
  }, [isDark]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const placesRes = await fetch("https://ontheway10.onrender.com/places");
        const placesData = await placesRes.json();
        const allPlaces = Array.isArray(placesData) ? placesData : [];

        const foundPlace = allPlaces.find((p) => p._id === id);
        setPlace(foundPlace || null);

        if (foundPlace && foundPlace.name) {
          const delegatesRes = await fetch(
            `https://ontheway10.onrender.com/delegates/${encodeURIComponent(foundPlace.name)}`
          );
          const delegatesData = await delegatesRes.json();
          setDelegates(Array.isArray(delegatesData) ? delegatesData : []);
        } else {
          setDelegates([]);
        }
      } catch (err) {
        console.error("Error fetching place or delegates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (adminFlag === "Y") {
      setCoords(null);
      setLocError("");
      setLocLoading(false);
    }
  }, [adminFlag]);

  const handleUseMyLocation = () => {
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocLoading(false);
        showMessage("Location detected successfully.");
      },
      (error) => {
        setLocLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocError("Location permission denied. Please allow access.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocError("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocError("Timed out while trying to get location.");
        } else {
          setLocError("Unable to retrieve your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleAddFavorite = (delegate) => {
    if (!place) return;
    dispatch(
      addFavorite({
        id: delegate._id,
        name: delegate.name,
        phone: delegate.phone,
        fee: delegate.fee,
        placeId: place._id,
        placeName: place.name,
      })
    );
    showMessage(`⭐ ${delegate.name} added to favorites!`);
  };

  const handleSelectDelegate = (delegate) => {
    if (!place) return;
    dispatch(
      setSelectedDelegate({
        id: delegate._id,
        name: delegate.name,
        phone: delegate.phone,
        fee: delegate.fee,
        placeId: place._id,
        placeName: place.name,
        userLocation: coords || null,
      })
    );
    setSelectedDelegateId(delegate._id);
    navigate("/order");
  };

  const startEditDelegate = (d) => {
    setEditingDelegateId(d._id);
    setEditName(d.name || "");
    setEditPhone(d.phone || "");
    setEditFee(d.fee != null ? String(d.fee) : "");
  };

  const cancelEditDelegate = () => {
    setEditingDelegateId(null);
    setEditName("");
    setEditPhone("");
    setEditFee("");
  };

  const saveDelegateChanges = async () => {
    if (!editingDelegateId || !place) return;
    if (!editName.trim() || !editPhone.trim() || !editFee) {
      showMessage("Please fill all delegate required fields.");
      return;
    }

    const payload = {
      email,
      name: editName,
      phone: editPhone,
      fee: Number(editFee),
      place: place.name,
    };

    try {
      const res = await fetch(`https://ontheway10.onrender.com/admin/delegate/${editingDelegateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.message || "Failed to update delegate.");
      } else {
        setDelegates((prev) =>
          prev.map((d) => (d._id === editingDelegateId ? data.delegate || { ...d, ...payload } : d))
        );
        showMessage("Delegate updated successfully.");
        cancelEditDelegate();
      }
    } catch (err) {
      console.error("Error updating delegate:", err);
      showMessage("Server error while updating delegate.");
    }
  };

  const deleteDelegate = async (delegateId) => {
    if (!window.confirm("Are you sure you want to delete this delegate?")) return;

    try {
      const res = await fetch(`https://ontheway10.onrender.com/admin/delegate/${delegateId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.message || "Failed to delete delegate.");
      } else {
        setDelegates((prev) => prev.filter((d) => d._id !== delegateId));
        if (editingDelegateId === delegateId) cancelEditDelegate();
        showMessage("Delegate deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting delegate:", err);
      showMessage("Server error while deleting delegate.");
    }
  };

  if (loading) {
    return (
      <div className="ontheway-page" style={styles.page}>
        <Container className="ontheway-wrapper mt-5" style={styles.wrapper}>
          <Row>
            <Col className="text-center">
              <p style={styles.sub}>Loading place details...</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="ontheway-page" style={styles.page}>
        <Container className="ontheway-wrapper mt-5" style={styles.wrapper}>
          <Row>
            <Col className="text-center">
              <p style={styles.sub}>Place not found.</p>
              <Link to="/home" style={styles.link}>
                Back to Home
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const sortedDelegates = [...delegates].sort((a, b) => (a.fee || 0) - (b.fee || 0));
  const mapsUrl = coords && `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;

  return (
    <div className="ontheway-page" style={styles.page}>
      <Container className="ontheway-wrapper mt-4" style={styles.wrapper}>
        <Row className="mb-3">
          <Col>
            <Link to="/home" style={styles.link}>
              ← Back to Home
            </Link>
          </Col>
        </Row>

        <Row className="mb-2 align-items-center">
          <Col md="8">
            <h2 style={styles.title}>Delivery Delegates for {place.name}</h2>
            {place.city && <p style={styles.sub}>Area: {place.city}</p>}
          </Col>

          <Col
            md="4"
            className="d-flex flex-column align-items-md-end align-items-start mt-3 mt-md-0"
          >
            {adminFlag !== "Y" && (
              <>
                <Button
                  size="sm"
                  onClick={handleUseMyLocation}
                  disabled={locLoading}
                  style={styles.btnSecondary}
                >
                  {locLoading ? "Detecting location..." : "📍 Use my current location"}
                </Button>

                {coords && (
                  <div style={styles.locBox}>
                    <div>
                      Lat: <b>{coords.lat.toFixed(5)}</b>, Lng: <b>{coords.lng.toFixed(5)}</b>
                    </div>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noreferrer" style={styles.link}>
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                )}

                {locError && <div style={styles.error}>{locError}</div>}
              </>
            )}
          </Col>
        </Row>

        {message && (
          <Row className="mb-3">
            <Col>
              <div style={styles.messageBox}>{message}</div>
            </Col>
          </Row>
        )}

        <Row>
          {sortedDelegates.length === 0 ? (
            <Col>
              <p style={styles.sub}>No delegates configured for this area yet.</p>
            </Col>
          ) : (
            sortedDelegates.map((d, index) => {
              const isEditing = editingDelegateId === d._id;
              const isSelected = d._id === selectedDelegateId;

              return (
                <Col md="4" key={d._id} className="mb-3">
                  <Card style={{ ...styles.card, ...(isSelected ? styles.selectedCard : {}) }}>
                    <CardBody className="text-center" style={{ padding: 16 }}>

                      <CardTitle tag="h5" style={styles.name}>
                        {d.name}
                      </CardTitle>

                      <CardText style={styles.meta}>📞 {d.phone}</CardText>

                      <CardText style={styles.fee}>
                        💰 Delivery Fee: {d.fee?.toFixed ? d.fee.toFixed(3) : `${d.fee} OMR`}
                      </CardText>

                      {index === 0 && <span style={styles.badgeLowest}>⭐ Lowest Delivery Fee</span>}

                      {adminFlag !== "Y" && (
                        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                          <Button
                            size="sm"
                            color="warning"
                            onClick={() => handleAddFavorite(d)}
                            style={{ ...styles.btnSecondary }}
                          >
                            ★ Add to Favorite
                          </Button>

                          <Button size="sm" onClick={() => handleSelectDelegate(d)} style={styles.btnPrimary}>
                            ✔ Select Delegate
                          </Button>
                        </div>
                      )}

                      {adminFlag === "Y" && (
                        <>
                          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                            <Button
                              size="sm"
                              color="warning"
                              onClick={() => startEditDelegate(d)}
                              style={{ ...styles.btnSecondary }}
                            >
                              Edit Delegate
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => deleteDelegate(d._id)}
                              style={{ ...styles.btnSecondary }}
                            >
                              Delete Delegate
                            </Button>
                          </div>

                          {isEditing && (
                            <div style={{ marginTop: 12, textAlign: "left" }}>
                              <div style={styles.divider} />

                              <p style={{ color: styles.name.color, fontWeight: 900, marginBottom: 10 }}>
                                Edit delegate details
                              </p>

                              <div className="mb-2">
                                <div style={styles.miniLabel}>Name</div>
                                <input value={editName} onChange={(e) => setEditName(e.target.value)} style={styles.miniInput} />
                              </div>

                              <div className="mb-2">
                                <div style={styles.miniLabel}>Phone</div>
                                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={styles.miniInput} />
                              </div>

                              <div className="mb-2">
                                <div style={styles.miniLabel}>Delivery Fee (OMR)</div>
                                <input type="number" step="0.1" value={editFee} onChange={(e) => setEditFee(e.target.value)} style={styles.miniInput} />
                              </div>

                              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                                <Button size="sm" onClick={saveDelegateChanges} style={styles.btnPrimary}>
                                  Save
                                </Button>
                                <Button size="sm" onClick={cancelEditDelegate} style={styles.btnSecondary}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </div>
  );
};

export default PlaceDetails;


