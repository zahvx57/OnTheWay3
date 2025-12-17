import { Container, Row, Col, FormGroup, Label, Button, Input } from "reactstrap";

import Logo from "../assets/logo.png";

import { UserRegisterSchemaValidation } from "../validations/UserRegisterSchemaValidation";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { addUser } from "../features/UserSlice";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
 
const Register = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const message = useSelector((state) => state.users.message);
 
  const {

    register,

    handleSubmit,

    formState: { errors },

  } = useForm({ resolver: yupResolver(UserRegisterSchemaValidation) });
 
  const onSubmit = (data) => {

    // data = { uname, pic, email, password }

    const payload = {

      uname: data.uname,

      email: data.email,

      password: data.password,

      profilepic: data.pic, // ✅ نفس اسم السيرفر

    };
 
    dispatch(addUser(payload));

    navigate("/");

  };
 
  return (
<div>
<Container fluid>
<Row className="div-row">
<Col md="6" className="div-col">
<form className="div-form" onSubmit={handleSubmit(onSubmit)}>
<div>
<img alt="Logo" className="img-fluid rounded mx-auto d-block" src={Logo} />
</div>
 
              <FormGroup>
<Label>UserName:</Label>
<Input

                  {...register("uname")}

                  placeholder="Please Enter your username here..."

                  type="text"

                />
<p style={{ color: "red" }}>{errors.uname?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Profile Picture:</Label>
<Input

                  {...register("pic")}

                  placeholder="Please Enter your Profile picture here..."

                  type="text"

                />
<p style={{ color: "red" }}>{errors.pic?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Email:</Label>
<Input

                  {...register("email")}

                  placeholder="Please Enter your Email here..."

                  type="email"

                />
<p style={{ color: "red" }}>{errors.email?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Password:</Label>
<Input

                  {...register("password")}

                  placeholder="Please Enter your Password here..."

                  type="password"

                />
<p style={{ color: "red" }}>{errors.password?.message}</p>
</FormGroup>
 
              <FormGroup>
<Button type="submit" className="form-control" color="dark">

                  Sign Up
</Button>
</FormGroup>
 
              <FormGroup>
<p>{message}</p>
</FormGroup>
</form>
</Col>
</Row>
</Container>
</div>

  );

};
 
export default Register;

 
