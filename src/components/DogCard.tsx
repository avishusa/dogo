import React from "react";
import { Dog } from "../services/apiService.tsx";
import styled from "styled-components";

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <Card>
      <Image src={dog.img} alt={dog.name} />
      <Info>
        <h3>{dog.name}</h3>
        <p>Breed: {dog.breed}</p>
        <p>Age: {dog.age} years</p>
        <p>Location: {dog.zip_code}</p>
      </Info>
    </Card>
  );
};

export default DogCard;

/* Styled Components */
const Card = styled.div`
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white; /* Ensure background is visible */
  width: 250px; /* Ensures all cards have the same width */
  min-width: 250px;
  max-width: 250px; /*  Prevents stretching */
`;
const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Info = styled.div`
  text-align: center;
  padding: 10px;
  h3 {
    color: #ff6f61;
  }
  p {
    color: #555;
  }
`;
