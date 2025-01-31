import React, { useEffect, useState, useCallback } from "react";
import {
  fetchDogsByIds,
  fetchDogs,
  fetchBreeds,
  fetchMatch,
  Dog,
  Match,
  fetchLocations,
  Location,
} from "../services/apiService.ts";
import DogCard from "../components/DogCard.tsx";
import SearchFilters from "../components/SearchFilters.tsx";
import {
  Container,
  DogGrid,
  PaginationButtons,
  ActionButton,
  DogCardWrapper,
} from "../styles/search.styled.ts";
import {
    // ...
    searchLocations,        // [NEW] we import searchLocations from apiService
    LocationSearchParams,
  } from "../services/apiService.ts";

const SearchPage: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [ageMin, setAgeMin] = useState<number>();
  const [ageMax, setAgeMax] = useState<number>();
  const [sortField, setSortField] = useState<"breed" | "name" | "age">("breed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [matchedDogId, setMatchedDogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationsMap, setLocationsMap] = useState<Record<string, Location>>({});
  const [statesInput, setStatesInput] = useState("");
  const [city, setCity] = useState("");
//   const [topLat, setTopLat] = useState<number | undefined>();
  const [zipCodes, setZipCodes] = useState<string[]>([]);

  // We want 25 dogs per page
  const pageSize = 25;

  // Force a refetch when filters are applied
  const [filterTrigger, setFilterTrigger] = useState(0);

  // The "cursor" or "page token" we pass into fetchDogs
  const [currentPageToken, setCurrentPageToken] = useState<string | undefined>();

  // We'll store next/prev tokens that come back from the API here
  const [pagination, setPagination] = useState<{ 
    prev?: string; 
    next?: string; 
  }>({});

  useEffect(() => {
    let isCancelled = false;

    const loadBreeds = async () => {
      try {
        const breedsList = await fetchBreeds();
        if (!isCancelled) {
          setBreeds(breedsList);
        }
      } catch (error) {
        console.error("Error loading breeds:", error);
      }
    };

    loadBreeds();
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
  
    const loadDogs = async () => {
      setIsLoading(true);
      try {
        
        const response = await fetchDogs(
          selectedBreed ? [selectedBreed] : [],
          // if we have zipCodes from location search, use them;
          // else, fallback to direct zipCode
          zipCodes.length > 0 ? zipCodes : zipCode ? [zipCode] : [],
          ageMin,
          ageMax,
          pageSize,
          currentPageToken,
          sortField,
          sortOrder
        );
  
        if (!isCancelled) {
          const fullDogs = response.resultIds.length
            ? await fetchDogsByIds(response.resultIds)
            : [];
          setDogs(fullDogs);
  
          setPagination({
            next: response.next || undefined,
            prev: response.prev || undefined,
          });
        }
      } catch (error) {
        console.error("Error loading dogs:", error);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
  
    loadDogs();
    return () => {
      isCancelled = true;
    };
  // [ADD zipCodes to the deps so we refetch if they change]
  }, [
    selectedBreed,
    zipCode,
    ageMin,
    ageMax,
    sortField,
    sortOrder,
    pageSize,
    currentPageToken,
    filterTrigger,
    zipCodes
  ]);
  

  useEffect(() => {
    if (!dogs.length) {
      setLocationsMap({});
      return;
    }

    const uniqueZips = Array.from(new Set(dogs.map((dog) => dog.zip_code)));

    //  The POST /locations endpoint can only handle 100 ZIPs at a time
    const chunkSize = 100;
    const zipChunks: string[][] = [];
    for (let i = 0; i < uniqueZips.length; i += chunkSize) {
      zipChunks.push(uniqueZips.slice(i, i + chunkSize));
    }

    let isCancelled = false;

    (async () => {
      try {
        //  Fire multiple fetchLocations() calls if needed
        const allLocationPromises = zipChunks.map((chunk) => fetchLocations(chunk));
        const allLocationArrays = await Promise.all(allLocationPromises);

        // Flatten results
        const allLocations = allLocationArrays.flat();

        if (!isCancelled) {
          // Convert to a map: { zip_code: Location }
          const map: Record<string, Location> = {};
          for (const loc of allLocations) {
            map[loc.zip_code] = loc;
          }
          setLocationsMap(map);
        }
      } catch (error) {
        console.error("Error loading location data:", error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [dogs,city,statesInput]);

  // Reset everything and force a re-fetch from page 1
  const applyFilters = useCallback(async () => {
    try {
      if (city || statesInput) {
        const statesArray = statesInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  
        const locationParams: LocationSearchParams = {};
        if (city) locationParams.city = city;
        if (statesArray.length > 0) locationParams.states = statesArray;
  
        const { results } = await searchLocations(locationParams);
        const zips = results.map(loc => loc.zip_code);
  
        setZipCodes(zips);
      } else {
        // if no city/states, reset zipCodes so we only rely on 'zipCode' 
        setZipCodes([]);
      }
  
      // now reset pagination, matched dogs, etc.
      setCurrentPageToken(undefined);
      setPagination({});
      setMatchedDogId(null);
      setFavorites([]);
      setDogs([]);
      setFilterTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error in applyFilters location step:", error);
    }
  }, [city, statesInput]);
  
  // Toggle dog as favorite
  const toggleFavorite = useCallback((dogId: string) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }, []);

  // Generate a match from current favorites
  const generateMatch = useCallback(async () => {
    if (favorites.length === 0) {
      alert("Please add some favorite dogs first!");
      return;
    }
    setMatchedDogId(null);
    setFavorites([]);

    const match: Match | null = await fetchMatch(favorites);
    console.log("Matched Dog ID:", match?.match);

    if (match?.match) {
      setMatchedDogId(match.match);
    } else {
      alert("No match found!");
    }
  }, [favorites]);

  // Reset matched dog
  const resetMatch = useCallback(() => {
    setMatchedDogId(null);
    setFavorites([]);
  }, []);

  // Go to next page
  const goToNextPage = useCallback(() => {
    if (pagination.next) {
      const url = new URL(pagination.next, "https://frontend-take-home-service.fetch.com");
      const fromParam = url.searchParams.get("from"); 
  
      if (fromParam) {
        setCurrentPageToken(fromParam);
        setFilterTrigger((prev) => prev + 1);
      }
    }
  }, [pagination.next]);
  
  // Go to previous page
  const goToPrevPage = useCallback(() => {
    if (pagination.prev) {
      const url = new URL(pagination.prev, "https://frontend-take-home-service.fetch.com");
      const fromParam = url.searchParams.get("from"); 
  
      if (fromParam) {
        setCurrentPageToken(fromParam);
        setFilterTrigger((prev) => prev + 1);
      }
    }
  }, [pagination.prev]);
    return (
    <Container>
      <h2>🐶 Find Your Perfect Dog 🐶</h2>

      <SearchFilters
        breeds={breeds}
        selectedBreed={selectedBreed}
        setSelectedBreed={setSelectedBreed}
        zipCode={zipCode}
        setZipCode={setZipCode}
        ageMin={ageMin}
        setAgeMin={setAgeMin}
        ageMax={ageMax}
        setAgeMax={setAgeMax}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        statesInput={statesInput}
        setStatesInput={setStatesInput}
        city={city}                 
        setCity={setCity}            
        // topLat={topLat}              // etc...
        // setTopLat={setTopLat}
      />

      <ActionButton onClick={applyFilters}>Apply Filters</ActionButton>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DogGrid>
          {dogs.map((dog) => {
              // We need to grab the location for this dog's zip
              const dogLocation = locationsMap[dog.zip_code];

              return (
                <DogCardWrapper key={dog.id} isMatched={dog.id === matchedDogId}>
                  <DogCard dog={dog} />

                  {/* Show city/state from the location if we have it */}
                  {dogLocation ? (
                    <p>
                      {dogLocation.city}, {dogLocation.state} (ZIP:{" "}
                      {dogLocation.zip_code})
                    </p>
                  ) : (
                    <p>Location not found</p>
                  )}
                <ActionButton
                  onClick={() => toggleFavorite(dog.id)}
                  className={favorites.includes(dog.id) ? "favorited" : ""}
                >
                  {favorites.includes(dog.id) ? "★ Favorited" : "☆ Favorite"}
                </ActionButton>
              </DogCardWrapper>
              );
})}
          </DogGrid>

          <ActionButton onClick={generateMatch}>Generate Match</ActionButton>
          {matchedDogId && <ActionButton onClick={resetMatch}>Reset Match</ActionButton>}

          <PaginationButtons>
            {pagination.prev && (
              <button onClick={goToPrevPage}>Previous</button>
            )}
            {pagination.next && (
              <button onClick={goToNextPage}>Next</button>
            )}
          </PaginationButtons>
        </>
      )}
    </Container>
  );
};

export default SearchPage;