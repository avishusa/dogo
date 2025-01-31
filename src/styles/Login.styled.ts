import styled from "styled-components";
import backgroundImage from "../assests/bg.jpg"; // Full page background
import dogImage from "../assests/dog-bg.jpg"; // Image for right side

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover; /* Still covers but prevents extreme zoom */
  background-position: cover; /* Adjusts position to avoid too much zoom */
  background-attachment: fixed; /* Keeps the background in place while scrolling */
  background-color: #f5f5f5;
`;



export const LoginWrapper = styled.div`
  display: flex;
  width: 70%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
`;

export const RightSection = styled.div`
  flex: 1;
  background: url(${dogImage}) no-repeat center center/cover;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const Title = styled.h2`
  color: #ff6f61;
  font-size: 26px;
  margin-bottom: 10px;
`;

export const Subtitle = styled.p`
  color: #444;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;

  &:hover {
    background: #ff473d;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;
