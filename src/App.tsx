import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Login from "./Login";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
