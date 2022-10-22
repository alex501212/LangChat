import Login from "./Login/login";
import Home from "./Home/home";
import Search from "./Search/search";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
