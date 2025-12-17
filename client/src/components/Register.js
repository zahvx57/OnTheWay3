import { Container, Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

import Logo from "../assets/logo.png";

import { UserRegisterSchemaValidation } from "../validations/UserRegisterSchemaValidation";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { addUser } from "../features/UserSlice";

import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
 
const Register = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isLoading, isSuccess, isError, message } = useSelector((s) => s.users);
 
  const {

    register,

    handleSubmit,

    formState: { errors },

  } = useForm({ resolver: yupResolver(UserRegisterSchemaValidation) });
 
  const onSubmit = (data) => {

    const payload = {

      uname: data.uname,

      email: data.email,

      password: data.password,

      profilepic: data.pic,

    };

    dispatch(addUser(payload));

  };
 
  useEffect(() => {

    if (isSuccess && !isError && message) navigate("/");

  }, [isSuccess, isError, message, navigate]);
 
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
<Input {...register("uname")} placeholder="Enter username..." />
<p style={{ color: "red" }}>{errors.uname?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Profile Picture:</Label>
<Input {...register("pic")} placeholder="Enter profile picture link..." />
<p style={{ color: "red" }}>{errors.pic?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Email:</Label>
<Input {...register("email")} type="email" placeholder="Enter email..." />
<p style={{ color: "red" }}>{errors.email?.message}</p>
</FormGroup>
 
              <FormGroup>
<Label>Password:</Label>
<Input {...register("password")} type="password" placeholder="Enter password..." />
<p style={{ color: "red" }}>{errors.password?.message}</p>
</FormGroup>
 
              {isError && <p style={{ color: "red" }}>{message}</p>}

              {!isError && message && <p>{message}</p>}
 
              <FormGroup>
<Button type="submit" className="form-control" color="dark" disabled={isLoading}>

                  {isLoading ? "Creating..." : "Sign Up"}
</Button>
</FormGroup>
</form>
</Col>
</Row>
</Container>
</div>

  );

};
 
export default Register;

 
