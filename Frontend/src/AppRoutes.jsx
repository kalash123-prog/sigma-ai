import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { ChatApp } from "./App.jsx"; 
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

const AppRoutes = () => {
  const { user, loading } = useAuth(); 

  // Wait for AuthContext to finish checking if we are logged in
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20%", fontSize: "20px" }}>
        Loading Sigma AI...
      </div>
    );
  }

  return (
    <Routes>
      {/* If NOT logged in, show Login/Signup. If logged in, instantly teleport to "/" */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

      {/* If logged in, show ChatApp. If NOT logged in, kick them to "/login" */}
      <Route path="/" element={user ? <ChatApp /> : <Navigate to="/login" />} />

      {/* If they type a random URL, catch them and redirect safely */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;