import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { useSelector } from "react-redux";

const Admin = () => {
  const user = useSelector((state) => state.users?.user);
  const email = user?.email;
  const adminFlag = user?.adminFlag;

  const themeMode = useSelector((state) => state.theme?.mode || "light");
  const isDark = themeMode === "dark";

  const [places, setPlaces] = useState([]);

  const [placeName, setPlaceName] = useState("");
  const [placeCity, setPlaceCity] = useState("");

  const [delegateName, setDelegateName] = useState("");
  const [delegatePhone, setDelegatePhone] = useState("");
  const [delegateFee, setDelegateFee] = useState("");
  const [delegateRating, setDelegateRating] = useState("4.5");
  const [delegateAvatarUrl, setDelegateAvatarUrl] = useState("");
  const [selectedPlaceName, setSelectedPlaceName] = useState("");

  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    fetch("https://ontheway10.onrender.com/places")
      .then((res) => res.json())
      .then((data) => setPlaces(Array.isArray(data) ? data : []));
  }, []);

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!placeName.trim()) return showMessage("Place name is required.");

    const res = await fetch("https://ontheway10.onrender.com/admin/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: placeName, city: placeCity }),
    });

    const data = await res.json();
    if (!res.ok) showMessage(data.message || "Failed");
    else {
      showMessage("Place added successfully.");
      setPlaceName("");
      setPlaceCity("");
      if (data.place) setPlaces((p) => [...p, data.place]);
    }
  };

  const handleAddDelegate = async (e) => {
    e.preventDefault();

    if (!delegateName || !delegatePhone || !delegateFee || !selectedPlaceName)
      return showMessage("Fill all required fields.");

    const res = await fetch("https://ontheway10.onrender.com/admin/delegate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: delegateName,
        phone: delegatePhone,
        fee: Number(delegateFee),
        rating: Number(delegateRating),
        avatar: delegateAvatarUrl,
        place: selectedPlaceName,
      }),
    });

    const data = await res.json();
    if (!res.ok) showMessage(data.message || "Failed");
    else {
      showMessage("Delegate added successfully.");
      setDelegateName("");
      setDelegatePhone("");
      setDelegateFee("");
      setDelegateRating("4.5");
      setDelegateAvatarUrl("");
      setSelectedPlaceName("");
    }
  };

  if (adminFlag !== "Y") {
    return (
      <div className={`page ${isDark ? "dark" : "light"}`}>
        <Container className="mt-5 text-center">
          <h2>Admin Panel</h2>
          <p>You are not authorized.</p>
        </Container>
      </div>
    );
  }

  return (
    <div className={`page ${isDark ? "dark" : "light"}`}>
      <Container className="mt-4">
        <h2 className="text-center mb-4">Admin Panel</h2>

        {message && <div className="alert-box">{message}</div>}

        <Row>
          <Col md="6">
            <Card className="custom-card">
              <CardBody>
                <h4>Add Place</h4>
                <Form onSubmit={handleAddPlace}>
                  <FormGroup>
                    <Label>Place Name *</Label>
                    <Input value={placeName} onChange={(e) => setPlaceName(e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>City</Label>
                    <Input value={placeCity} onChange={(e) => setPlaceCity(e.target.value)} />
                  </FormGroup>
                  <Button color="primary">Add Place</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col md="6">
            <Card className="custom-card">
              <CardBody>
                <h4>Add Delegate</h4>
                <Form onSubmit={handleAddDelegate}>
                  <FormGroup>
                    <Label>Name *</Label>
                    <Input value={delegateName} onChange={(e) => setDelegateName(e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Phone *</Label>
                    <Input value={delegatePhone} onChange={(e) => setDelegatePhone(e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Fee *</Label>
                    <Input type="number" value={delegateFee} onChange={(e) => setDelegateFee(e.target.value)} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Place *</Label>
                    <Input type="select" value={selectedPlaceName} onChange={(e) => setSelectedPlaceName(e.target.value)}>
                      <option value="">Select</option>
                      {places.map((p) => (
                        <option key={p._id} value={p.name}>{p.name}</option>
                      ))}
                    </Input>
                  </FormGroup>
                  <Button color="success">Add Delegate</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx="true">{`
        .page.light { background: #f8f9fa; min-height: 100vh; }
        .page.dark { background: #000000ff; min-height: 100vh; color: #fff; }

        .custom-card {
          background: ${isDark ? "#303030ff" : "#fff"};
          color: ${isDark ? "#fff" : "#000"};
          border: ${isDark ? "1px solid #1f2937" : "1px solid #ddd"};
        }

        input, select {
          background: ${isDark ? "#575858ff" : "#fff"} !important;
          color: ${isDark ? "#fff" : "#000"} !important;
          border: 1px solid ${isDark ? "#1f2937" : "#ccc"};
        }

        .alert-box {
          background: ${isDark ? "#1e293b" : "#e7f4ff"};
          color: ${isDark ? "#93c5fd" : "#0057b7"};
          padding: 10px;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default Admin;


