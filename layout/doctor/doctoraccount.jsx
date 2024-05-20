

import React, { useState } from "react";
import axios from "axios";

import {
  Button,
  Input,
  Layout,
  Typography,
  Form,
  Select,
  Checkbox,
  Row,
  Col,
  TimePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import Header from "./../components/doctorheader";
const { Content } = Layout;
const { TextArea } = Input;

const DoctorAccount = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleNavigate = () => {
    navigate("/doctorsideappointments");
  };

  const [interval, setInterval] = useState(30);
  const [doctorFormData, setDoctorFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address: "",
    specialty: "",
    fee: "",
    startTime: "",
    endTime: "",
    availableDays: [],
    availableSlots: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checkedValues) => {
    setDoctorFormData((prevData) => ({
      ...prevData,
      availableDays: checkedValues,
    }));
  };

  const generateTimeSlots = (startTime, endTime, interval) => {
    const parseTime = (timeStr) => {
      const time = new Date(`1970/01/01 ${timeStr}`);
      if (timeStr === "6:00" && time.getHours() < 12) {
        time.setHours(time.getHours() + 12);
      }
      return time;
    };

    let start = parseTime(startTime);
    let end = parseTime(endTime);
    let slots = [];

    while (start <= end) {
      slots.push(
        start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
      start = new Date(start.getTime() + interval * 60000);
    }

    return slots;
  };

  const onFinish = async () => {
    try {
      const generatedSlots = generateTimeSlots(
        doctorFormData.startTime,
        doctorFormData.endTime,
        interval
      );

      const updatedFormData = {
        ...doctorFormData,
        availableSlots: generatedSlots,
      };

      const response = await axios.post(
        "http://localhost:5000/addDoctor",
        updatedFormData
      );

      console.log("Server Response:", response.data);
      alert("Successfully added doctor!");
      form.resetFields();
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to add doctor!");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header backButtonLink="/" />
      <Content
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            margin: "16px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Typography.Title
            style={{ color: "Black", marginRight: "auto" }}
            level={3}
          >
            Create Account
          </Typography.Title>
          <Button type="primary" onClick={handleNavigate}>
            Appointments
          </Button>
        </div>
        <div
          style={{
            background: "#f0f2f5",
            padding: "20px",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="vertical"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
                { type: "string", message: "First name must be a string!" },
              ]}
            >
              <Input
                name="firstName"
                value={doctorFormData.firstName}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
                { type: "string", message: "Last name must be a string!" },
              ]}
            >
              <Input
                name="lastName"
                value={doctorFormData.lastName}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
                { pattern: /^\d{10}$/, message: "Phone number must be 10 digits!" },
              ]}
            >
              <Input
                name="phoneNumber"
                value={doctorFormData.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                name="email"
                value={doctorFormData.email}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
                { type: "string", message: "Address must be a string!" },
              ]}
            >
              <TextArea
                rows={4}
                name="address"
                value={doctorFormData.address}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Specialty"
              name="specialty"
              rules={[
                { required: true, message: "Please input your specialty!" },
                { type: "string", message: "Specialty must be a string!" },
              ]}
            >
              <Input
                name="specialty"
                value={doctorFormData.specialty}
                onChange={handleInputChange}
              />
            </Form.Item>

            <Form.Item
              label="Fee"
              name="fee"
              rules={[{ required: true, message: "Please input your fee!" },
              { message: "Fee must be a number!" },
              ]}
            >
              <Input
                name="fee"
                value={doctorFormData.fee}
                onChange={handleInputChange}
                type="number"
              />
            </Form.Item>
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={[{ required: true, message: "Please input start time!" }]}
            >
              <TimePicker
                name="startTime"
                value={
                  doctorFormData.startTime
                    ? doctorFormData.startTime
                    : null
                }
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleInputChange({
                    target: { name: "startTime", value: timeString },
                  })
                }
                showSecond={false}
              />
            </Form.Item>

            <Form.Item
              label="End Time"
              name="endTime"
              rules={[{ required: true, message: "Please input end time!" }]}
            >
              <TimePicker
                name="endTime"
                value={doctorFormData.endTime ? doctorFormData.endTime : null}
                format="HH:mm"
                onChange={(time, timeString) =>
                  handleInputChange({
                    target: { name: "endTime", value: timeString },
                  })
                }
                showSecond={false}
              />
            </Form.Item>

            <Form.Item
              label="Available Days"
              name="availableDays"
              rules={[
                { required: true, message: "Please select available days!" },
              ]}
            >
              <Checkbox.Group
                value={doctorFormData.availableDays}
                onChange={handleCheckboxChange}
              >
                <Row>
                  <Col span={8}>
                    <Checkbox value="Monday">Monday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Tuesday">Tuesday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Wednesday">Wednesday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Thursday">Thursday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Friday">Friday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Saturday">Saturday</Checkbox>
                  </Col>
                  <Col span={8}>
                    <Checkbox value="Sunday">Sunday</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default DoctorAccount;
