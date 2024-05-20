import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
 

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";


////////////////login/////////////////////////////
import Register from "./../layout/login/registeer.jsx";
import Login from "./../layout/login/login.jsx";

/////////////////patient side/////////////////////////
import PatientHomepage from "./../layout/patient/Homepage.jsx";
import BookingAppointment from "./../layout/patient/bookingappointment.jsx";
import PatientSideAppointments from "./../layout/patient/patientsideappointmnet.jsx";


////////////////////doctor side//////////////////////////////
import DoctorSideAppointments from "./../layout/doctor/doctorsideappointments.jsx";
import DoctorHomepage from "./../layout/doctor/doctoraccount.jsx";
import DoctorProfile from "./../layout/doctor/doctorprofile.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Login />}></Route>
      <Route
        index={true}
        path="/register"
        element={<Register />}
      ></Route>
       <Route
        index={true}
        path="/patienthomepage"
        element={<PatientHomepage />}
      ></Route>
      <Route
        index={true}
        path="/bookingappointment"
        element={<BookingAppointment />}
      ></Route>
       <Route
        index={true}
        path="/patientsidesppointments"
        element={<PatientSideAppointments />}
      ></Route>
      <Route
        index={true}
        path="/doctorsideappointments"
        element={<DoctorSideAppointments />}
      ></Route>
      <Route
        index={true}
        path="/doctorhomepage"
        element={<DoctorHomepage />}
      ></Route>
       <Route
        index={true}
        path="/doctorprofile"
        element={<DoctorProfile />}
      ></Route>
    </Route>
    
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={ router}></RouterProvider>
  </React.StrictMode>,
)
