import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #ffffff;
    color: #333;
  }
`;

// Styled components
const Header = styled.header`
  background: #FF4D6B;
  padding: 15px;
  text-align: center;
  color: white;
`;

const Nav = styled.nav`
  margin: 20px;
  text-align: center;
  
  a {
    margin: 0 15px;
    text-decoration: none;
    color: #FF4D6B;
    font-weight: bold;
  }
`;

const Card = styled.div`
  width: 300px;
  height: 400px;
  background: #f9f9f9;
  border-radius: 10px;
  margin: 20px auto;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.12), 0 6px 6px rgba(0,0,0,0.08);
  position: relative;
  transition: transform 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.03);
  }
`;

const CardImage = styled.div`
  background-image: url('https://via.placeholder.com/300x250');
  background-size: cover;
  height: 250px;
`;

const CardDetails = styled.div`
  padding: 15px;
  text-align: center;
`;

const Button = styled.button`
  background: #8A2BE2;
  border: none;
  padding: 10px 20px;
  color: white;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
`;

const Home: React.FC = () => (
  <div>
    <h2>Welcome to DSpot</h2>
    <Card>
      <CardImage />
      <CardDetails>
        <h3>Alex, 28</h3>
        <p>⭐⭐⭐⭐☆</p>
        <Button>Swipe Right</Button>
      </CardDetails>
    </Card>
  </div>
);

const SignUp: React.FC = () => (
  <div>
    <h2>Sign Up</h2>
    <p>Create your account to start matching.</p>
    {/* Add your signup form here */}
  </div>
);

const Login: React.FC = () => (
  <div>
    <h2>Login</h2>
    <p>Access your DSpot account.</p>
    {/* Add your login form here */}
  </div>
);

const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Header>
      <h1>DSpot</h1>
    </Header>
    <Nav>
      <Link to="/">Home</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Login</Link>
    </Nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </>
);

export default App;