import React from "react";
import styled from "styled-components";

interface SearchFiltersProps {
  breeds: string[];
  selectedBreed: string;
  setSelectedBreed: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
  ageMin?: number;
  setAgeMin: (value: number) => void;
  ageMax?: number;
  setAgeMax: (value: number) => void;
  sortField: "breed" | "name" | "age";
  setSortField: (value: "breed" | "name" | "age") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  breeds,
  selectedBreed,
  setSelectedBreed,
  zipCode,
  setZipCode,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <FiltersContainer>
      <label>
        Breed:
        <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>
      </label>

      <label>Zip Code: 
        <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
      </label>

      <label>Age Min: 
        <input type="number" value={ageMin || ""} onChange={(e) => setAgeMin(Number(e.target.value))} />
      </label>

      <label>Age Max: 
        <input type="number" value={ageMax || ""} onChange={(e) => setAgeMax(Number(e.target.value))} />
      </label>

      <label>
        Sort by:
        <select value={sortField} onChange={(e) => setSortField(e.target.value as "breed" | "name" | "age")}>
          <option value="breed">Breed</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
      </label>

      <label>
        Order:
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </FiltersContainer>
  );
};

export default SearchFilters;

/*  Add the missing FiltersContainer styled component */
const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  background: transparent; /* Make background fully transparent */
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  label {
    font-size: 16px;
    font-weight: bold; /* Make font bold */
    color: #444;
  }

  input, select {
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

