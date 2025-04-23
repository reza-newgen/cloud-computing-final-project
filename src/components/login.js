import React, { useState, useEffect } from "react";
import "../App.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom"; // ✅ NEW

export default function LoginForm() {
  const [jwtToken, setJwtToken] = useState("");
  const navigate = useNavigate(); // ✅ NEW

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
      localStorage.setItem("jwtToken", token);

      // ✅ Redirect to homepage after successful login
      navigate("/");
    } catch (error) {
      console.log("Error fetching JWT token:", error);
      localStorage.removeItem("jwtToken");
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          Welcome {user.username}
          <button
            onClick={() => {
              signOut();
              localStorage.removeItem("jwtToken");
              navigate("/login"); // ✅ Optional: redirect after logout
            }}
          >
            Sign out
          </button>
          <h4>Your JWT token:</h4>
          <textarea
            value={jwtToken}
            readOnly
            style={{ width: "100%", height: "80px" }}
          />
        </div>
      )}
    </Authenticator>
  );
}
