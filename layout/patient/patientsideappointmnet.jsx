

import React, { useEffect, useState } from 'react';
import { Button, Layout, Typography, Table } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import Header from "./../components/patientheader";

const { Content } = Layout;

const Appointments = () => {
  const location = useLocation();
  const { email } = location.state || {};

  const [appointments, setAppointments] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserEmail(userData.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchAppointments(userEmail);
    }
  }, [userEmail]);

  const fetchAppointments = async (email) => {
    try {
      const response = await fetch('https://healtcare-frontend.onrender.com/fetchingAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientEmail: email }),
      });
      const data = await response.json();
      if (response.ok) {
        setAppointments(data.appointments);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const columns = [
    { title: "Patient Name", dataIndex: "patientName", key: "patientName" },
    { title: "Patient Email", dataIndex: "patientEmail", key: "patientEmail" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time Slot", dataIndex: "timeSlot", key: "timeSlot" },
    { title: "Doctor", key: "doctor", render: (text, record) => `${record.firstName} ${record.lastName}` },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header backButtonLink="/patienthomepage" />
      <Content style={{ padding: "24px" }}>
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <Typography.Title level={3}>Appointments</Typography.Title>
        </div>
        <div style={{ background: "#f0f2f5", borderRadius: 8 }}>
          <Table
            dataSource={appointments}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Appointments;
