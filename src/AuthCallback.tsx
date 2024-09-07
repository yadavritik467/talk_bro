// AuthCallback.js
import axios from "axios";
import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const fetchUser = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      if (code) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/google/callback?code=${code}`
          );
          console.log(response.data); // User data from Google
          // Handle user data (e.g., save to state, redirect, etc.)
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchUser();
  }, []);

  return <div>Loading...</div>;
};

export default AuthCallback;
