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
  Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateProfile, changePassword, clearMessage } from "../features/UserSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.users?.user || {});
  const themeMode = useSelector((state) => state.theme?.mode || "light");
  const isDark = themeMode === "dark";

  const { isLoading, message, isError, isSuccess } = useSelector(
    (state) => state.users
  );

  const isAdmin = user?.adminFlag === "Y";


  const [currentEmail, setCurrentEmail] = useState(user?.email || "");

  const [uname, setUname] = useState(user?.uname || "");
  const [pic, setPic] = useState(user?.profilepic || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const hasUser = user && Object.keys(user).length > 0;
    if (!hasUser) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    setCurrentEmail(user?.email || "");
    setUname(user?.uname || "");
    setPic(user?.profilepic || "");
  }, [user]);

  const inputStyle = {
    backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
    color: isDark ? "#ffffff" : "#000000",
    borderColor: isDark ? "#444" : "#ced4da",
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    if (!currentEmail) {
      alert("Current email is missing.");
      return;
    }

    await dispatch(
      updateProfile({
        currentEmail,
        uname,
        pic, 
      })
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    dispatch(clearMessage());

    if (!user?.email) {
      alert("Email not found for this user.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    await dispatch(
      changePassword({
        email: user.email,
        currentPassword,
        newPassword,
      })
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="ontheway-page"
      style={{
        backgroundColor: isDark ? "#000000" : "#ffffff",
        minHeight: "100vh",
        paddingTop: "30px",
      }}
    >
      <Container className="ontheway-wrapper">
        <Row className="justify-content-center mt-4">
          <Col md="8" lg="6">
            <Card
              style={{
                backgroundColor: isDark ? "#3f3f3f" : "#ffffff",
                color: isDark ? "#ffffff" : "#000000",
                borderRadius: "14px",
              }}
            >
              <CardBody>
                <h3 className="text-center mb-4">
                  {isAdmin ? "Admin Profile" : "Profile"}
                </h3>

                <div className="text-center mb-3">
                  <img
                    src={pic || "https://via.placeholder.com/90"}
                    alt="profile"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: isDark ? "1px solid #555" : "1px solid #ddd",
                    }}
                  />
                </div>

                {message ? (
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "12px",
                      fontSize: "0.95rem",
                      color: isError
                        ? "#ffb3b3"
                        : isSuccess
                        ? "#b7ffb7"
                        : isDark
                        ? "#fff"
                        : "#000",
                    }}
                  >
                    {message}
                  </div>
                ) : null}

                <Form onSubmit={handleSaveProfile}>
                  <FormGroup>
                    <Label>{isAdmin ? "Admin Name" : "Full Name"}</Label>
                    <Input
                      value={uname}
                      onChange={(e) => setUname(e.target.value)}
                      style={inputStyle}
                      placeholder="Enter your name"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Profile Picture URL</Label>
                    <Input
                      value={pic}
                      onChange={(e) => setPic(e.target.value)}
                      style={inputStyle}
                      placeholder="https://..."
                    />
                  </FormGroup>

                  <Button color="primary" block type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner size="sm" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Form>

                <hr className="my-4" />

                <Form onSubmit={handleChangePassword}>
                  <FormGroup>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                      className={isDark ? "pwd-input-dark" : "pwd-input-light"}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={inputStyle}
                      className={isDark ? "pwd-input-dark" : "pwd-input-light"}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={inputStyle}
                      className={isDark ? "pwd-input-dark" : "pwd-input-light"}
                    />
                  </FormGroup>

                  <Button color="primary" block type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Spinner size="sm" /> Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .pwd-input-dark {
          color: #ffffff !important;
          caret-color: #ffffff !important;
        }
        .pwd-input-dark::placeholder {
          color: #e0e0e0 !important;
          opacity: 1 !important;
        }
        .pwd-input-dark:-webkit-autofill,
        .pwd-input-dark:-webkit-autofill:hover,
        .pwd-input-dark:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          box-shadow: 0 0 0 1000px #1f1f1f inset !important;
        }
        .pwd-input-light {
          color: #000000 !important;
        }
        .pwd-input-light::placeholder {
          color: #6c757d !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Profile;

