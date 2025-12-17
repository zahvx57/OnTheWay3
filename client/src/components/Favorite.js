import React, { useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, CardText, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFavorite, clearFavorites } from "../features/FavoriteSlice";

const Favorite = () => {
  const email = useSelector((state) => state.users?.user?.email);
  const favorites = useSelector((state) => state.favorites?.list || []);
  const theme = useSelector((state) => state.theme?.mode || "light");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  const styles = useMemo(() => {
    const isDark = theme === "dark";
    return {
      page: {
        minHeight: "100vh",
        background: isDark ? "#121212" : "#f6f7fb",
        color: isDark ? "#e5e7eb" : "#111827",
        paddingBottom: "32px",
      },
      title: {
        color: isDark ? "#e5e7eb" : "#111827",
        fontWeight: 600,
        letterSpacing: "0.5px",
        margin: 0,
      },
      subtitle: {
        color: isDark ? "#9ca3af" : "#6b7280",
        marginTop: "8px",
        fontSize: "14px",
      },
      card: {
        background: isDark ? "#111827" : "#ffffff",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
        borderRadius: "14px",
        boxShadow: isDark
          ? "0 10px 30px rgba(0,0,0,0.35)"
          : "0 10px 25px rgba(0,0,0,0.08)",
      },
      emptyBox: {
        background: isDark ? "#3d3d3dff" : "#ffffff",
        color: isDark ? "#cbd5e1" : "#000000ff",
        padding: "16px 24px",
        borderRadius: "14px",
        textAlign: "center",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
        boxShadow: isDark
          ? "0 10px 30px rgba(0,0,0,0.35)"
          : "0 10px 25px rgba(0,0,0,0.08)",
        fontSize: "14px",
      },
      avatarWrap: {
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "16px",
        border: theme === "dark"
          ? "2px solid rgba(255,255,255,0.12)"
          : "2px solid rgba(0,0,0,0.06)",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        overflow: "hidden",
        flexShrink: 0,
      },
      avatar: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
      initials: {
        fontWeight: 900,
        letterSpacing: "0.6px",
        color: isDark ? "#e5e7eb" : "#111827",
      },
      infoTitle: {
        marginBottom: "4px",
        color: isDark ? "#e5e7eb" : "#111827",
      },
      infoText: {
        marginBottom: "2px",
        color: isDark ? "#cbd5e1" : "#374151",
      },
      feeText: {
        marginBottom: "2px",
        fontWeight: 600,
        color: isDark ? "#e5e7eb" : "#111827",
      },
      removeBtn: {
        background: isDark ? "#000000ff" : undefined,
        borderColor: isDark ? "#334155" : undefined,
      },
      clearBtn: {
        borderRadius: "10px",
        boxShadow: isDark ? "0 10px 18px rgba(239,68,68,0.2)" : undefined,
      },
    };
  }, [theme]);

  const getInitials = (txt = "") => {
    const s = String(txt).trim();
    if (!s) return "★";
    const parts = s.split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };

  return (
    <div className="ontheway-page" style={styles.page}>
      <Container className="ontheway-wrapper">
        <Row className="mt-4">
          <Col xs="12" className="text-center">
            <h2 className="ontheway-title" style={styles.title}>
              Favorite Delegates
            </h2>
            <p style={styles.subtitle}>
              These are the delegates you added to your favorites list.
            </p>
          </Col>
        </Row>

        {favorites.length > 0 && (
          <Row className="mt-3">
            <Col className="text-center">
              <Button
                color="danger"
                size="sm"
                style={styles.clearBtn}
                onClick={() => dispatch(clearFavorites())}
              >
                Clear All Favorites
              </Button>
            </Col>
          </Row>
        )}

        <Row className="justify-content-center mt-4">
          <Col md="10" lg="8">
            {favorites.length === 0 ? (
              <div style={styles.emptyBox}>
                No favorites yet. Go to a place and add some delegates ⭐
              </div>
            ) : (
              favorites.map((fav) => {
                const key = fav.id ?? fav._id ?? fav.favId;
                const img = fav.pic || fav.avatar || "";
                return (
                  <Card key={key} className="mb-3" style={styles.card}>
                    <CardBody className="d-flex align-items-center">
                      <div style={styles.avatarWrap}>
                        {img ? (
                          <img src={img} alt={fav.name} style={styles.avatar} />
                        ) : (
                          <div style={styles.initials}>{getInitials(fav.name)}</div>
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <h5 style={styles.infoTitle}>{fav.name}</h5>

                        {fav.placeName && (
                          <CardText style={styles.infoText}>📍 {fav.placeName}</CardText>
                        )}

                        {fav.city && (
                          <CardText style={styles.infoText}>📍 {fav.city}</CardText>
                        )}

                        {fav.phone && (
                          <CardText style={styles.infoText}>📞 {fav.phone}</CardText>
                        )}

                        {fav.fee != null && fav.fee !== "" && (
                          <CardText style={styles.feeText}>💰 {fav.fee}</CardText>
                        )}
                      </div>

                      <Button
                        color="secondary"
                        size="sm"
                        style={styles.removeBtn}
                        onClick={() => dispatch(removeFavorite(key))}
                      >
                        Remove
                      </Button>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Favorite;
