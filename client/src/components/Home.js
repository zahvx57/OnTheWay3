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
  "#f66","#69f","#93f","#7c5","#c5a","#f90","#0af","#0a7",
  "#8b4","#8844ff","#dd4477","#11aabb","#bb4455","#22cc88",
  "#3399ff","#cc9955","#5566ee","#33aa44","#dd6633","#cc33aa",
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

  // =====================
  // ✅ UPDATED: fetch places
  // =====================
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("https://ontheway10.onrender.com/getPlaces");
        const data = await res.json();
        setPlaces(Array.isArray(data?.places) ? data.places : []);
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

    try {
      const res = await fetch(
        `https://ontheway10.onrender.com/admin/place/${editingPlaceId}`,
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
            p._id === editingPlaceId ? data.place : p
          )
        );
        showMessage("Place updated successfully.");
        handleCancelEdit();
      }
    } catch {
      showMessage("Server error while updating place.");
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;

    try {
      const res = await fetch(
        `https://ontheway10.onrender.com/admin/place/${placeId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        showMessage(data.message || "Failed to delete place.");
      } else {
        setPlaces((prev) => prev.filter((p) => p._id !== placeId));
        showMessage("Place deleted successfully.");
      }
    } catch {
      showMessage("Server error while deleting place.");
    }
  };

  const filteredPlaces = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return places.filter((place) => {
      if (!q) return true;
      return (
        place.name?.toLowerCase().startsWith(q) ||
        makeShort(place.name).toLowerCase().startsWith(q)
      );
    });
  }, [places, searchText]);

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0f1115" : "#f4f6fb" }}>
      <Container style={{ paddingTop: 20 }}>
        <Row>
          <Col>
            <img src={Logo} alt="logo" height={60} />
            <h2>OnTheWay</h2>
            <p>
              {isAdmin
                ? "Admin view: edit and delete places directly from here."
                : "Browse places and choose the best one for your needs."}
            </p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md="8">
            <InputGroup>
              <Input
                placeholder="Search place..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <InputGroupText>
                <FiSearch />
              </InputGroupText>
            </InputGroup>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            {loading ? (
              <p>Loading...</p>
            ) : filteredPlaces.length === 0 ? (
              <p>No places found</p>
            ) : (
              filteredPlaces.map((place, i) => (
                <div key={place._id} style={{ marginBottom: 12 }}>
                  <strong>{place.name}</strong>
                  {place.city && (
                    <div>
                      <FaMapMarkerAlt /> {place.city}
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ marginTop: 6 }}>
                      <Button
                        size="sm"
                        color="warning"
                        onClick={() => handleStartEdit(place)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDeletePlace(place._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}

                  {editingPlaceId === place._id && (
                    <div style={{ marginTop: 10 }}>
                      <Input
                        value={editPlaceName}
                        onChange={(e) => setEditPlaceName(e.target.value)}
                        placeholder="Place name"
                        className="mb-2"
                      />
                      <Input
                        value={editPlaceCity}
                        onChange={(e) => setEditPlaceCity(e.target.value)}
                        placeholder="City"
                        className="mb-2"
                      />
                      <Button color="primary" onClick={handleSaveEdit}>
                        Save
                      </Button>{" "}
                      <Button color="secondary" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
