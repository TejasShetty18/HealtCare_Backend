

import React, { useState } from "react";
import { Button, Layout, Typography, Checkbox, Input, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./authentication.js"; // Adjust the import path as needed
import "../../src/index.css";

const { Header, Content } = Layout;

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    is_doctor: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const navigate = useNavigate();

  const handleFormSubmit = async () => {
    console.log("data is: ", formData);

    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Send user data to backend for saving in Firestore
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, uid: user.uid }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log("Registration successful:", data);
        message.success("Successfully Registered");
        navigate('/');
      } else {
        console.error("Registration failed:", data.message);
        message.error("Registration failed");
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        message.error("Email already in use");
      } else {
        console.error("Error during registration:", error);
        message.error("Registration failed");
      }
    }
  };

  return (
    <div className="appBg">
      <Form
        className="registerForm"
        onFinish={handleFormSubmit}
        initialValues={{
          is_doctor: false,
        }}
      >
        <Typography.Title>REGISTRATION</Typography.Title>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input your name!",
            },
          ]}
        >
          <Input name="name" value={formData.name} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input name="email" value={formData.email} onChange={handleInputChange} />
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
          <Input.Password name="password" value={formData.password} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item name="is_doctor" valuePropName="checked">
          <Checkbox name="is_doctor" checked={formData.is_doctor} onChange={handleInputChange}>
            Is Doctor?
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <span>Already registered? </span>
          <a href="/" className="red-link">Login</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MyForm;

