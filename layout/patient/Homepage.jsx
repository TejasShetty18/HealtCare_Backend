

// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Input, Layout, Row, Col, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Header from "./../components/patientheader";

const { Content, Footer } = Layout;

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // State for the search input
  // const [userName, setUserName] = useState("");
  // const location = useLocation();
  // const { name, email } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDoctors();
  
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/fetchalldoctor");
      setDoctors(response.data.list || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(error);
    }
  };

  const handleNavigate = () => {
    navigate('/patientsidesppointments');
    
  };

  const handleSearch = async () => {
    if (!search.trim()) return fetchAllDoctors(); // Fetch all doctors if search is empty

    try {
      const response = await axios.post("http://localhost:5000/searchDoctor", {
        firstName: search.split(" ")[0], // Assuming the first part is first name
        lastName: search.split(" ")[1] || "", // Assuming the second part is last name, if provided
      });

      if (response.data.data) {
        setDoctors(response.data.data);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error searching for doctor:", error);
      setError(error);
    }
  };

  if (error) {
    return <div>Failed to load doctors. Please try again later.</div>;
  }

  return (
    <Layout style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Header
        backButtonLink="/"
        // onLogout={() => console.log("Logout clicked")}
      />
      <Content
        style={{
          padding: "0 24px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            margin: "16px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form
            onFinish={handleSearch}
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Input
              placeholder="Please search the Doctor name exactly given in the card"
              prefix={<SearchOutlined />}
              style={{ flexGrow: 1, marginRight: 8 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="primary" onClick={handleNavigate}>Appointments</Button>
          </Form>
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            {doctors.map((doctor) => (
              <Col key={doctor.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`${doctor.firstName} ${doctor.lastName}`}
                  bordered={false}
                  style={{ width: "100%" }}
                  onClick={() => navigate('/bookingappointment', { state: { data: doctor } })}
                >
                  <p>Speciality: {doctor.specialty}</p>
                  <p>Email: {doctor.email}</p>
                  <p>Phone: {doctor.phoneNumber}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        {/* Footer content remains unchanged */}
      </Footer>
    </Layout>
  );
};

export default Home;
