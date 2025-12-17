import { Container, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import Logo from "../assets/logo.png";
import { UserSchemaValidation } from "../validations/userSchemaValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit: submitForm,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserSchemaValidation) });

  const validate = () => {
    const data = {
      email: email,
      password: password,
    };
    dispatch(getUser(data));
  };

  useEffect(() => {
    if (user && isSuccess) {
      navigate("/home");
    }
    if (isError) {
      navigate("/");
    }
  }, [user, isSuccess, isError, navigate]);

  return (
    <div>
      <Container fluid>
        <Row className="div-row">
          <Col md="6" className="div-col">
            <form className="div-form">
              <div>
                <img
                  alt="Logo"
                  className="img-fluid rounded mx-auto d-block"
                  src={Logo}
                />
              </div>

              <FormGroup>
                <Label>Email</Label>
                <input
                  {...register("email", {
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  placeholder="Please Enter your Email here..."
                  type="email"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.email?.message}</p>
              </FormGroup>

              <FormGroup>
                <Label>Password</Label>
                <input
                  {...register("password", {
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  placeholder="Please Enter your Password here..."
                  type="password"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.password?.message}</p>
              </FormGroup>

              <FormGroup>
                <Input type="checkbox" /> <Label>Remmber Me</Label>
              </FormGroup>

              <FormGroup>
                <Button
                  type="button"  // ✅ added to prevent form submit issues
                  onClick={submitForm(validate)}
                  className="form-control"
                  color="dark"
                >
                  Sign In
                </Button>
              </FormGroup>

              <FormGroup className="text-center">
                <Label>Forget password</Label>
              </FormGroup>

              <FormGroup className="text-center">
                <Label>
                  No Account? <Link to="/register">Sign Up Now...</Link>
                </Label>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
