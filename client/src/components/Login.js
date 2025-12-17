import { Container, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";
import Logo from "../assets/logo.png";
import { UserSchemaValidation } from "../validations/userSchemaValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
 
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const user = useSelector((state) => state.users.user);
  const isSuccess = useSelector((state) => state.users.isSuccess);
  const isError = useSelector((state) => state.users.isError);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(UserSchemaValidation) });
 
  const onSubmit = (data) => {
    // data = { email, password }
    dispatch(getUser(data));
  };
 
  useEffect(() => {
    if (user && isSuccess) navigate("/home");
    // لا داعي تعمل navigate("/") عند isError لأنك أصلاً في صفحة /
  }, [user, isSuccess, navigate]);
 
  return (
<div>
<Container fluid>
<Row className="div-row">
<Col md="6" className="div-col">
            {/* ✅ خلي الفورم هو اللي يعمل submit */}
<form className="div-form" onSubmit={handleSubmit(onSubmit)}>
<div>
<img alt="Logo" className="img-fluid rounded mx-auto d-block" src={Logo} />
</div>
 
              <FormGroup>
<Label>Email</Label>
<Input
                  {...register("email")}
                  placeholder="Please Enter your Email here..."
                  type="email"
                />
<p style={{ color: "red" }}>{errors.email?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Password</Label>
<Input
                  {...register("password")}
                  placeholder="Please Enter your Password here..."
                  type="password"
                />
<p style={{ color: "red" }}>{errors.password?.message}</p>
</FormGroup>
 
              <FormGroup>
<Input type="checkbox" /> <Label>Remember Me</Label>
</FormGroup>
 
              <FormGroup>
                {/* ✅ زر submit الحقيقي */}
<Button type="submit" className="form-control" color="dark">
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
