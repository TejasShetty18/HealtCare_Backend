

import { React, useState, useEffect } from "react";
import { Button, Layout, Typography, Table, message } from "antd";
import { Link, useLocation } from "react-router-dom";
import Header from "./../components/doctorheader";

const { Content } = Layout;

const PatientAppointment = () => {
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
      const response = await fetch('http://localhost:5000/fetchingAllAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await response.json();
      if (response.ok) {
        // Add a key property to each appointment for identification
        const appointmentsWithKey = data.appointments.map((appointment, index) => ({
          ...appointment,
          key: appointment.id || index // Ensure each appointment has a unique key
        }));
        setAppointments(appointmentsWithKey);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleAccept = async (key) => {
    console.log(`Updating status for appointment with key: ${key}`); // Debugging line
    try {
      const response = await fetch('http://localhost:5000/updatebooking', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: key, status: 'Confirmed' }),
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Booking status updated successfully');
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.key === key
              ? { ...appointment, status: 'Confirmed' }
              : appointment
          )
        );
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error('Error updating status');
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Patient Email",
      dataIndex: "patientEmail",
      key: "patientEmail",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time Slot",
      dataIndex: "timeSlot",
      key: "timeSlot",
    },
    {
      title: "Doctor",
      key: "doctor",
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleAccept(record.key)}
          disabled={record.status === 'Confirmed'}
        >
          {record.status === 'Confirmed' ? 'Accepted' : 'Accept'}
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header backButtonLink="/doctorhomepage" />
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

export default PatientAppointment;

