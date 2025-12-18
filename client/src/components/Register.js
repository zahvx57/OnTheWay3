import { Container, Row, Col, FormGroup, Label, Button, Input } from "reactstrap";
import Logo from "../assets/logo.png";
import { UserRegisterSchemaValidation } from "../validations/UserRegisterSchemaValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUser } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector((state) => state.users.message);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(UserRegisterSchemaValidation),
    mode: "onSubmit",
  });

  // Reactstrap + RHF fix
  const { ref: unameRef, ...unameReg } = register("uname");
  const { ref: picRef, ...picReg } = register("pic");
  const { ref: emailRef, ...emailReg } = register("email");
  const { ref: passRef, ...passReg } = register("password");

  const onSubmit = (data) => {
    const payload = {
      uname: data.uname,
      email: data.email,
      password: data.password,
      profilepic: data.pic,
    };

    dispatch(addUser(payload));
  };

  // ⏳ بعد ما المسج تظهر اعمل Navigate
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  return (
    <div>
      <Container fluid>
        <Row className="div-row">
          <Col md="6" className="div-col">
            <form className="div-form" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <img
                  alt="Logo"
                  className="img-fluid rounded mx-auto d-block"
                  src={Logo}
                />
              </div>

              <FormGroup>
                <Label>UserName:</Label>
                <Input
                  innerRef={unameRef}
                  {...unameReg}
                  placeholder="Please Enter your username here..."
                  type="text"
                />
                {errors.uname && (
                  <p style={{ color: "red" }}>{errors.uname.message}</p>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Profile Picture:</Label>
                <Input
                  innerRef={picRef}
                  {...picReg}
                  placeholder="Please Enter your Profile picture here..."
                  type="text"
                />
                {errors.pic && (
                  <p style={{ color: "red" }}>{errors.pic.message}</p>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Email:</Label>
                <Input
                  innerRef={emailRef}
                  {...emailReg}
                  placeholder="Please Enter your Email here..."
                  type="email"
                />
                {errors.email && (
                  <p style={{ color: "red" }}>{errors.email.message}</p>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Password:</Label>
                <Input
                  innerRef={passRef}
                  {...passReg}
                  placeholder="Please Enter your Password here..."
                  type="password"
                />
                {errors.password && (
                  <p style={{ color: "red" }}>{errors.password.message}</p>
                )}
              </FormGroup>

              <FormGroup>
                <Button type="submit" className="form-control" color="dark">
                  Sign Up
                </Button>
              </FormGroup>

              <FormGroup>
                {/* ✅ مسج النجاح / الفشل */}
                {message && (
                  <p style={{ color: "green", textAlign: "center" }}>
                    {message}
                  </p>
                )}
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;

