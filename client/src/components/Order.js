import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearSelectedDelegate } from "../features/SelectedDelegateSlice";

const Order = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = useSelector((state) => state.users?.user?.email);
  const selectedDelegate = useSelector(
    (state) => state.selectedDelegate?.delegate
  );

  const themeMode = useSelector((state) => state.theme?.mode) || "light";
  const isDark = themeMode === "dark";

  const [location, setLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [error, setError] = useState("");

  const userLocation = selectedDelegate?.userLocation || null;
  const mapsUrl =
    userLocation &&
    `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;

  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

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
      page: {
        minHeight: "100vh",
        background: bg,
        paddingBottom: 80,
        paddingTop: 14,
      },
      wrapper: { maxWidth: 980, marginTop: 14 },

      title: {
        color: text,
        fontWeight: 900,
        fontSize: "1.55rem",
        marginBottom: 6,
      },
      subtitle: { color: muted, marginTop: 6, fontSize: "0.92rem" },

      card: {
        background: cardBg,
        border,
        borderRadius: 16,
        boxShadow: shadow,
      },

      info: { color: text, marginBottom: 6, fontWeight: 600 },
      fee: { color: text, marginBottom: 10, fontWeight: 900 },

      pill: {
        background: pillBg,
        border,
        borderRadius: 14,
        padding: "12px 14px",
        textAlign: "left",
        color: text,
      },
      pillTitle: { fontWeight: 900, marginBottom: 6, fontSize: "0.95rem" },
      pillSmall: { fontSize: "0.86rem", color: muted },

      label: { color: text, fontWeight: 800, marginBottom: 6 },

      input: {
        background: isDark ? "#1b1b1b" : "#ffffff",
        color: text,
        border,
        borderRadius: 12,
        padding: "10px 12px",
      },

      btnPrimary: {
        background: isDark ? "#3f3f3f" : "#111827",
        color: isDark ? TEXT_DARK : "#ffffff",
        border,
        borderRadius: 12,
        padding: "10px 18px",
        fontWeight: 900,
      },

      btnSecondary: {
        background: isDark ? "#2f2f2f" : "#ffffff",
        color: text,
        border,
        borderRadius: 12,
        padding: "8px 12px",
        fontWeight: 800,
      },

      link: {
        color: linkColor,
        textDecoration: "none",
        fontWeight: 800,
      },

      error: {
        marginTop: 10,
        color: "#ff6b6b",
        fontWeight: 800,
        fontSize: "0.92rem",
      },

      divider: {
        height: 1,
        background: isDark ? "rgba(255,255,255,0.10)" : "#eef2f7",
        margin: "14px 0",
      },
    };
  }, [isDark]);

  if (!selectedDelegate) {
    return (
      <div style={styles.page}>
        <Container style={styles.wrapper}>
          <Row>
            <Col className="text-center">
              <h2 style={styles.title}>Order / Checkout</h2>
              <p style={styles.subtitle}>
                No delegate selected. Please choose a delegate first.
              </p>
              <Link to="/home" style={styles.link}>
                ← Back to Home
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  const handleUseDetectedLocation = () => {
    if (mapsUrl) {
      setLocation(mapsUrl);
      setError("");
    }
  };

  const handleConfirmOrder = () => {
    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    alert(
      `Your order has been confirmed!\n\nDelegate: ${selectedDelegate.name}\nLocation: ${location}\nPayment Method: ${paymentMethod.toUpperCase()}`
    );

    dispatch(clearSelectedDelegate());
    navigate("/home");
  };

  return (
    <div style={styles.page}>
      <Container style={styles.wrapper}>
        <Row>
          <Col className="text-center">
            <h2 style={styles.title}>Order / Checkout</h2>
            <p style={styles.subtitle}>
              Review your selected delegate and fill in your details.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col md="8" lg="6">
            <Card style={styles.card}>
              <CardBody className="text-center">
                <h4 style={{ color: styles.info.color, fontWeight: 900 }}>
                  {selectedDelegate.name}
                </h4>

                <CardText style={styles.info}>
                  📍 {selectedDelegate.placeName}
                </CardText>
                <CardText style={styles.info}>
                  📞 {selectedDelegate.phone}
                </CardText>
                <CardText style={styles.fee}>
                  💰 {selectedDelegate.fee} OMR
                </CardText>

                {userLocation && (
                  <div style={styles.pill}>
                    <div style={styles.pillTitle}>Detected Location</div>
                    <div style={styles.pillSmall}>
                      Lat: <b>{userLocation.lat}</b> , Lng:{" "}
                      <b>{userLocation.lng}</b>
                    </div>

                    {mapsUrl && (
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    )}

                    <div style={{ marginTop: 10 }}>
                      <Button
                        size="sm"
                        onClick={handleUseDetectedLocation}
                        style={styles.btnSecondary}
                      >
                        Use detected location
                      </Button>
                    </div>
                  </div>
                )}

                <div style={styles.divider} />

                <Form style={{ textAlign: "left" }}>
                  <FormGroup>
                    <Label style={styles.label}>Customer Location</Label>
                    <Input
                      type="text"
                      placeholder="Enter address or paste Google Maps link"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      style={styles.input}
                    />
                  </FormGroup>

                  <FormGroup style={{ marginTop: 12 }}>
                    <Label style={styles.label}>Payment Method</Label>
                    <Input
                      type="select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={styles.input}
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="wallet">Wallet / Online Payment</option>
                    </Input>
                  </FormGroup>

                  {error && <div style={styles.error}>{error}</div>}

                  <div style={{ marginTop: 18, textAlign: "center" }}>
                    <Button
                      onClick={handleConfirmOrder}
                      style={styles.btnPrimary}
                    >
                      Confirm Order
                    </Button>
                  </div>

                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    <Link to="/home" style={styles.link}>
                      ← Change delegate
                    </Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Order;
