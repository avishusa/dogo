import styled from "styled-components";
import backgroundImage from "../assests/bg.jpg"; // Full page background


export const Container = styled.div`
  padding: 40px;
  text-align: center;
  background: url(${backgroundImage}) no-repeat center center;
  background-size: cover;
  background-position: center;
  
  min-height: 100vh; /*  Ensures full screen height even if no content */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /*  Keeps content centered vertically */
`;

export const DogGrid = styled.div`
  display: flex;
  justify-content: center; /*  Centers single card */
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

export const DogCardWrapper = styled.div.withConfig({
    shouldForwardProp: (prop) => prop !== "isMatched" //  Prevents passing `isMatched` to DOM
  })<{ isMatched: boolean }>`
    padding: 20px;
    border-radius: 10px;
    background: ${(props) => (props.isMatched ? "#ffeb3b" : "#f8f8f8")}; // Highlight matched dog
    border: 2px solid ${(props) => (props.isMatched ? "#ff9800" : "#ccc")}; // Orange border for matched dog
    box-shadow: ${(props) => (props.isMatched ? "0px 4px 12px rgba(255, 152, 0, 0.6)" : "0px 2px 6px rgba(0, 0, 0, 0.1)")}; // Glow effect
    transition: all 0.3s ease-in-out;
    transform: ${(props) => (props.isMatched ? "scale(1.05)" : "scale(1)")}; // Slightly enlarge matched dog
    text-align: center;
  `;

export const PaginationButtons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;

  button {
    padding: 10px 20px;
    background: #ff6f61;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: #ff473d;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

export const FavoriteButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 16px;
  background: #ffcc00;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #ffdb4d;
    transform: scale(1.05);
  }

  &.favorited {
    background: #ff6f61;
    color: white;
  }
`;

export const ActionButton = styled.button`
  margin-top: 15px;
  padding: 10px 15px;
  font-size: 16px;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #ff473d;
    transform: scale(1.05);
  }

  &.favorited {
    background: #ffcc00;
    color: black;
  }
`;
