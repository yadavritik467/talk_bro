import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Login from "./Login";
import "./index.css";
import Home from "./Home";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { useEffect } from "react";
import { allUsers, myProfile } from "./redux/action/userAction";

const App = () => {
  const { access_token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(myProfile());
      dispatch(allUsers());
    }
  }, [dispatch, access_token]);
  return (
    <div className="w-full h-[100vh]">
      <BrowserRouter>
        <Routes>
          {access_token ? (
            <Route path="home" element={<Home />} />
          ) : (
            <>
              <Route path="" element={<Login />} />
              <Route path="auth/callback" element={<AuthCallback />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
