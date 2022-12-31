import Login from "./Login/Login";
import Home from "./Home/Home";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import Admin from "./Admin/Admin";
import Chat from "./Chat/Chat";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavHeader from "../components/NavHeader";

function App() {
  return (
    <BrowserRouter>
      <NavHeader />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
