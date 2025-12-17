import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Button, Input, Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaces, addPlace, togglePlace, deletePlace } from "../features/PlacesSlice";

const PlacesPanel = () => {
  const dispatch = useDispatch();
  const { places, isLoading, message, isError } = useSelector((s) => s.places);
  const user = useSelector((s) => s.users.user);
  const isAdmin = user?.adminFlag === "Y";

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const handleAdd = () => {
    if (!name.trim()) return;
    dispatch(addPlace({ name: name.trim(), adminFlag: user?.adminFlag }));
    setName("");
  };

  const visiblePlaces = isAdmin ? places : places.filter((p) => p.isActive);

  return (
    <Card className="mt-3">
      <CardBody>
        <CardTitle tag="h5">المناطق</CardTitle>

        {isAdmin && (
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أضف منطقة جديدة..."
            />
            <Button color="primary" onClick={handleAdd} disabled={isLoading}>
              إضافة
            </Button>
          </div>
        )}

        {isLoading && <Spinner />}

        {message && (
          <p style={{ color: isError ? "red" : "green", marginTop: 8 }}>{message}</p>
        )}

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {visiblePlaces.map((p) => (
            <div
              key={p._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                opacity: !p.isActive ? 0.55 : 1,
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                {isAdmin && (
                  <small>{p.isActive ? "Active ✅" : "Inactive ⛔"}</small>
                )}
              </div>

              {isAdmin && (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    size="sm"
                    color={p.isActive ? "warning" : "success"}
                    onClick={() =>
                      dispatch(togglePlace({ id: p._id, adminFlag: user?.adminFlag }))
                    }
                  >
                    {p.isActive ? "تعطيل" : "تفعيل"}
                  </Button>

                  <Button
                    size="sm"
                    color="danger"
                    onClick={() =>
                      dispatch(deletePlace({ id: p._id, adminFlag: user?.adminFlag }))
                    }
                  >
                    حذف
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default PlacesPanel;
