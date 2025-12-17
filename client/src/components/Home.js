import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPlaces } from "../features/PlacesSlice";
import { addFavorite } from "../features/FavoriteSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const places = useSelector((state) => state.places.places);
  const themeMode = useSelector((state) => state.theme.mode);
  const isDark = themeMode === "dark";

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  return (
    <Container fluid className={isDark ? "bg-dark text-light" : "bg-light"}>
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h3 className="fw-bold">📍 Available Places</h3>
            <p className="text-muted">
              Choose your destination and enjoy the service
            </p>
          </Col>
        </Row>

        <Row>
          {places?.length === 0 && (
            <p className="text-center text-muted">No places available</p>
          )}

          {places?.map((place) => (
            <Col md="4" sm="6" xs="12" className="mb-4" key={place._id}>
              <Card
                className="h-100 shadow-sm"
                style={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  color: isDark ? "#fff" : "#000",
                  border: isDark ? "1px solid #374151" : "1px solid #eee",
                }}
              >
                <img
                  src={place.pic}
                  alt={place.name}
                  className="img-fluid"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <CardBody>
                  <CardTitle tag="h5">{place.name}</CardTitle>
                  <CardText className="text-muted">
                    {place.description?.slice(0, 70)}...
                  </CardText>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => navigate(`/place/${place._id}`)}
                    >
                      View Details
                    </Button>

                    <Button
                      size="sm"
                      outline
                      color={isDark ? "light" : "dark"}
                      onClick={() => dispatch(addFavorite(place))}
                    >
                      ❤ Favorite
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default Home;

