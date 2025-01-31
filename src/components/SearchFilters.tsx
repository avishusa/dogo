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
  city: string;                
  setCity: (value: string) => void; 
  statesInput: string;              
  setStatesInput: (value: string) => void;  

//   topLat?: number;             
//   setTopLat: (value?: number) => void;  
//   topLon?: number;              
//   setTopLon: (value?: number) => void;  
//   leftLat?: number;             
//   setLeftLat: (value?: number) => void; 
//   leftLon?: number;             
//   setLeftLon: (value?: number) => void; 
//   bottomLat?: number;           
//   setBottomLat: (value?: number) => void; 
//   bottomLon?: number;           
//   setBottomLon: (value?: number) => void; 
//   rightLat?: number;           
//   setRightLat: (value?: number) => void;  
//   rightLon?: number;           
//   setRightLon: (value?: number) => void;  
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
  city,            
  setCity,         
  statesInput,     
  setStatesInput,  
//   topLat,          
//   setTopLat,       
//   topLon,          
//   setTopLon,       
//   leftLat,         
//   setLeftLat,     
//   leftLon,         
//   setLeftLon,      
//   bottomLat,       
//   setBottomLat,    
//   bottomLon,       
//   setBottomLon,    
//   rightLat,      
//   setRightLat,    
//   rightLon,        
//   setRightLon,     
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

      <label>
        City:
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>

      <label>
        States:
        <input
          type="text"
          placeholder="e.g. CA,NY,TX"
          value={statesInput}
          onChange={(e) => setStatesInput(e.target.value)}
        />
      </label>

      {/* <fieldset>
        <legend>Geo Bounding Box</legend>

        <label>
          Top Lat:
          <input
            type="number"
            step="any"
            value={topLat ?? ""}
            onChange={(e) => setTopLat(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>
        <label>
          Top Lon:
          <input
            type="number"
            step="any"
            value={topLon ?? ""}
            onChange={(e) => setTopLon(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>

        <label>
          Left Lat:
          <input
            type="number"
            step="any"
            value={leftLat ?? ""}
            onChange={(e) => setLeftLat(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>
        <label>
          Left Lon:
          <input
            type="number"
            step="any"
            value={leftLon ?? ""}
            onChange={(e) => setLeftLon(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>

        <label>
          Bottom Lat:
          <input
            type="number"
            step="any"
            value={bottomLat ?? ""}
            onChange={(e) => setBottomLat(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>
        <label>
          Bottom Lon:
          <input
            type="number"
            step="any"
            value={bottomLon ?? ""}
            onChange={(e) => setBottomLon(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>

        <label>
          Right Lat:
          <input
            type="number"
            step="any"
            value={rightLat ?? ""}
            onChange={(e) => setRightLat(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>
        <label>
          Right Lon:
          <input
            type="number"
            step="any"
            value={rightLon ?? ""}
            onChange={(e) => setRightLon(e.target.value ? Number(e.target.value) : undefined)}
          />
        </label>
      </fieldset> */}

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
    display: flex;
    flex-direction: column;
    margin-right: 10px;
  }

   fieldset {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 0 10px;
    border-radius: 5px;
  }

  legend {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, select {
    margin-left: 10px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;

  }
`;

