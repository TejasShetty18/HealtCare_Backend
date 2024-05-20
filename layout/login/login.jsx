


import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./authentication.js"; // Adjust the import path as needed
import "../../src/index.css";

const Loginform = () => {
  const [loginformData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const login = async () => {
    console.log("data is: ", loginformData);

    try {
      // Check if email and password are correct using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, loginformData.email, loginformData.password);
      const user = userCredential.user;

      // Send email to backend for further verification
      const response = await fetch("https://healtcare-frontend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginformData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login successful:", data);

        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));

        // Redirect based on user type
        if (data.message === "Doctor Login successful") {
          navigate('/doctorhomepage'); // Pass doctor's name to doctorhomepage
        } else if (data.message === "Patient Login successful") {
          navigate('/patienthomepage'); // Pass patient's name to patienthomepage
        }
      } else {
        console.error("Login failed:", data.message);
        message.error("Login failed: " + data.message);
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        message.error("No user found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        message.error("Incorrect password.");
      } else {
        console.error("Error during login:", error);
        message.error("Error during login: " + error.message);
      }
    }
  };

  return (
    <div className="appBg">
      <Form
        className="loginForm"
        onFinish={login}
        initialValues={{
          is_doctor: false,
        }}
      >
        <Typography.Title>LOGIN</Typography.Title>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: "email",
              message: "The input is not a valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input name="email" value={loginformData.email} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password name="password" value={loginformData.password} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            LOGIN
          </Button>
        </Form.Item>

        <Form.Item>
          <span>Do not have an account? </span>
          <a href="/registeer" className="red-link">Register</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Loginform;
