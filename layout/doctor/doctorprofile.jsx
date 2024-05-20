

import React, { useEffect } from "react";
import {
  Button,
  Input,
  Layout,
  Typography,
  Form,
  Checkbox,
  Row,
  Col,
} from "antd";
import { useLocation } from "react-router-dom";
import Header from "./../components/doctorheader";
import axios from 'axios';

const { Content } = Layout;
const { TextArea } = Input;

const MyProfile = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    // Function to fetch doctor profile data
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.post("http://localhost:5000/fetchingDoctorprofile", { email });
        if (response.status === 200) {
          const doctorProfile = response.data.data[0];
          // Populate the form fields with the fetched data
          form.setFieldsValue({
            id: doctorProfile.id, // Assuming the doctor profile has an 'id' field
            firstName: doctorProfile.firstName,
            lastName: doctorProfile.lastName,
            phoneNumber: doctorProfile.phoneNumber,
            email: doctorProfile.email,
            address: doctorProfile.address,
            specialty: doctorProfile.specialty,
            fee: doctorProfile.fee,
            startTime: doctorProfile.startTime,
            endTime: doctorProfile.endTime,
            availableDays: doctorProfile.availableDays,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (email) {
      fetchDoctorProfile();
    }
  }, [email, form]);

  const onFinish = async (values) => {
    try {
      const response = await axios.patch("http://localhost:5000/updateDoctor", values);
      if (response.status === 200) {
        console.log("Doctor updated successfully");
        alert("Doctor data updated successfully")
      } else {
        console.error("Failed to update doctor profile");
        alert("Failed to update doctor profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header backButtonLink="/doctorhomepage" />
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
            alignItems: "left",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Typography.Title
            style={{ color: "black", marginRight: "auto" }}
            level={3}
          >
            Profile
          </Typography.Title>
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
          >
            <Form.Item name="id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item label="Personal Details" style={{ marginBottom: "0" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                      { type: "string", message: "First name must be a string!" },
                    ]}
                  >
                    <Input readOnly/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                      { type: "string", message: "Last name must be a string!" },
                    ]}
                  >
                    <Input readOnly/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                      { pattern: /^\d{10}$/, message: "Phone number must be 10 digits!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                      { type: "email", message: "Invalid email format!" },
                    ]}
                  >
                    <Input readOnly/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Please input your address!" },
                    { type: "string", message: "Address must be a string!" },
                  ]}
                >
                  <TextArea
                rows={4}
              />
                </Form.Item>
              </Row>
            </Form.Item>

            <hr style={{ margin: "10px 0" }} />

            <Form.Item
              label="Professional Details"
              style={{ marginBottom: "0" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="specialty"
                    label="Specialty"
                    rules={[
                      { required: true, message: "Please select specialty!" },
                      { type: "string", message: "Specialty must be a string!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="fee"
                    label="Fee"
                    rules={[{ required: true, message: "Please input fee!" },
                    { message: "Fee must be a number!" },
                    ]}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="workingHours" label="Working Hours">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="startTime"
                          rules={[
                            {
                              required: true,
                              message: "Please select start time!",
                            },
                          ]}
                        >
                          <Input placeholder="Start Time" readOnly/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="endTime"
                          rules={[
                            {
                              required: true,
                              message: "Please select end time!",
                            },
                          ]}
                        >
                          <Input placeholder="End Time" readOnly/>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="availableDays"
                    label="Select Available Days"
                    initialValue={[]}
                  >
                    <Checkbox.Group>
                      <Checkbox value="Monday">Mon</Checkbox>
                      <Checkbox value="Tuesday">Tue</Checkbox>
                      <Checkbox value="Wednesday">Wed</Checkbox>
                      <Checkbox value="Thursday">Thu</Checkbox>
                      <Checkbox value="Friday">Fri</Checkbox>
                      <Checkbox value="Saturday">Sat</Checkbox>
                      <Checkbox value="Sunday">Sun</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default MyProfile;
