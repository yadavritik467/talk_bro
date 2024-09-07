import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Login from "./Login";
import "./index.css";
import Home from "./Home";

const App = () => {
  return (
    <div className="w-full h-[100vh]">
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
