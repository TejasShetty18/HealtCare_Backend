

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Layout,
  Typography,
  DatePicker,
  Tooltip,
  Form,
  Row,
  Col,
  Radio,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./../components/patientheader";

const { Content } = Layout;
const { TextArea } = Input;

const BookingAppointment = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialty: "",
    address: "",
    email: "",
    fee: "",
    phoneNumber: "",
    availableDays: "",
    startT: "",
    endT: "",
    availableSlots: [],
  });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const getEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const interval = 30; // Assuming 30-minute slots, you can change this as needed
    const endTime = new Date(0, 0, 0, hours, minutes + interval);
    return endTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (location.state && location.state.data) {
      const data = location.state.data;
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        specialty: data.specialty,
        address: data.address,
        email: data.email,
        fee: data.fee,
        phoneNumber: data.phoneNumber,
        availableDays: data.availableDays,
        availableSlots: data.availableSlots,
        startT: data.startTime,
        endT: data.endTime,
      });
      form.setFieldsValue({
        specialty: data.specialty,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        fee: data.fee,
        availableDays: data.availableDays,
      });
    }
  }, [location, form]);

  const fetchUnavailableSlots = async (date) => {
    try {
      const response = await axios.post("https://healtcare-frontend.onrender.com/checkBookedSlots", {
        date: date.format("YYYY-MM-DD"),
        email: formData.email,
      });
      setUnavailableSlots(response.data.matchingSlots);
    } catch (error) {
      console.error("Error checking booked slots:", error);
      alert("Failed to fetch booked slots");
    }
  };

  const onFinish = async (values) => {
    const appointmentData = {
      ...formData,
      patientName: values.patientName,
      patientEmail: values.patientEmail,
      description: values.description,
      date: values.date.format("YYYY-MM-DD"),
      timeSlot: selectedSlot,
    };

    try {
      await axios.post("https://healtcare-frontend.onrender.com/bookingAppointment", appointmentData);
      alert("Successfully booked appointment");
      form.resetFields(); // Clear form fields
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  };

  const onCancel = () => {
    form.resetFields(); // Clear form fields
  };

  return (
    <Layout
      style={{
        height: "100vh",
        width: "100%",
        overflow: "auto",
        position: "fixed",
      }}
    >
      <Header backButtonLink="/patienthomepage" />
      <Content
        style={{
          padding: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxHeight: "80vh",
            width: "100%",
            maxWidth: "960px",
          }}
        >
          <h2>{`${formData.firstName} ${formData.lastName}`}</h2>
          <hr />
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            style={{
              padding: "25px",
              borderRadius: "4px",
              width: "100%",
            }}
          >
            {/* Form fields */}
            <Row gutter={16}>
              {/* Left column */}
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {/* Specialty */}
                <Form.Item label="Speciality" name="specialty">
                  <Input name="specialty" value={formData.specialty} readOnly />
                </Form.Item>
                {/* Email */}
                <Form.Item label="Email" name="email">
                  <Input name="email" value={formData.email} readOnly />
                </Form.Item>
                {/* Phone */}
                <Form.Item label="Phone" name="phoneNumber">
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    readOnly
                  />
                </Form.Item>
                {/* Patient Name */}
                <Form.Item label="Patient Name" name="patientName">
                  <Input />
                </Form.Item>
                {/* Patient Email */}
                <Form.Item
                  label="Patient Email"
                  name="patientEmail"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not a valid E-mail!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                {/* Description */}
                <Form.Item label="Description" name="description">
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              {/* Right column */}
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                {/* Address */}
                <Form.Item label="Address" name="address">
                <TextArea rows={4} name="address" value={formData.address} readOnly />
                  {/* <Input name="address" value={formData.address} readOnly /> */}
                </Form.Item>
                {/* Fee */}
                <Form.Item label="Fee" name="fee">
                  <Input name="fee" value={formData.fee} readOnly />
                </Form.Item>
                {/* Available Days */}
                <Form.Item label="Select Available Days" name="availableDays">
                  <Input
                    name="availableDays"
                    value={formData.availableDays}
                    readOnly
                  />
                </Form.Item>
                {/* Select Date */}
                <Form.Item label="Select Date" name="date">
                  <DatePicker
                    onChange={(date) => {
                      form.setFieldsValue({ date });
                      fetchUnavailableSlots(date);
                    }}
                  />
                </Form.Item>
                {/* Time Slot */}
                <Form.Item label="Time Slot" name="timeSlot">
                  {formData.availableSlots &&
                  formData.availableSlots.length > 0 ? (
                    <Radio.Group
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <Row gutter={[16, 16]}>
                        {formData.availableSlots.map((slot, index) => (
                          <Col key={index} xs={24} sm={12} md={8} lg={8} xl={6}>
                            <Radio.Button
                              value={slot}
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                backgroundColor: unavailableSlots.includes(slot)
                                  ? "gray"
                                  : "white",
                              }}
                              disabled={unavailableSlots.includes(slot)}
                            >
                              {slot} - {getEndTime(slot)}
                            </Radio.Button>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  ) : (
                    <div>No available slots</div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* Buttons */}
            <Row justify="center">
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Book
                  </Button>
                  <Button
                    style={{ marginLeft: "8px" }}
                    htmlType="button"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default BookingAppointment;


