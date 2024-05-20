import React, { useEffect, useState } from 'react';
import { Button, Typography, Tooltip } from 'antd';
import { LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ backButtonLink }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.name);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("user");
    // Perform any additional logout operations, e.g., redirect to login page
    // onLogout();
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 25px',
        backgroundColor: '#001529',
      }}
    >
      <Link to={backButtonLink}>
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          style={{ color: 'white' }}
        />
      </Link>
      <Typography.Title
        style={{
          color: 'white',
          margin: 0,
          flexGrow: 1,
          textAlign: 'center',
        }}
        level={2}
      >
        HealthCare
      </Typography.Title>
      {userName && (
        <div style={{ color: 'white', marginLeft: 'auto', marginRight: '20px' }}>{userName}</div>
      )}
      <Tooltip title="Logout">
        <Button
          type="primary"
          shape="circle"
          icon={<LogoutOutlined />}
          style={{ color: 'white' }}
          onClick={handleLogout}
        />
      </Tooltip>
    </div>
  );
};

export default Header;
