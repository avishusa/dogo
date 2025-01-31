import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authServices.tsx";
import { AuthContext } from "../context/AuthContext.tsx";
import {
    LeftSection,
    RightSection,
    Container,
    LoginWrapper,
    Title,
    Subtitle,
    Input,
    Button,
    ErrorMessage,
  } from "../styles/Login.styled.ts";

const LoginPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(name, email);
      localStorage.setItem("loginTime", new Date().getTime().toString()); 
      if (authContext) {
        authContext.isAuthenticated = true;
      }
      
      navigate("/search"); // Redirect to search page
    } catch (err) {
      setError("Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginWrapper>
      <LeftSection>
          <Title>🐶 Welcome to Dog Lovers! 🐶</Title>
          <Subtitle>Login to find your perfect dog!</Subtitle>
          <form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LeftSection>
        <RightSection /> {/* Dog Image */}
      </LoginWrapper>
    </Container>
  );
};

export default LoginPage;
