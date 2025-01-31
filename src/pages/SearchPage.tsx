import React, { useEffect, useState, useCallback } from "react";
import {
  fetchDogsByIds,
  fetchDogs,
  fetchBreeds,
  fetchMatch,
  Dog,
  Match,
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
          zipCode ? [zipCode] : [],
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
  ]);

  // Reset everything and force a re-fetch from page 1
  const applyFilters = useCallback(() => {
    setCurrentPageToken(undefined); // back to the first page
    setPagination({});
    setMatchedDogId(null);
    setFavorites([]);
    setDogs([]);
    setFilterTrigger((prev) => prev + 1);
  }, []);

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
      />

      <ActionButton onClick={applyFilters}>Apply Filters</ActionButton>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <DogGrid>
            {dogs.map((dog) => (
              <DogCardWrapper key={dog.id} isMatched={dog.id === matchedDogId}>
                <DogCard dog={dog} />
                <ActionButton
                  onClick={() => toggleFavorite(dog.id)}
                  className={favorites.includes(dog.id) ? "favorited" : ""}
                >
                  {favorites.includes(dog.id) ? "★ Favorited" : "☆ Favorite"}
                </ActionButton>
              </DogCardWrapper>
            ))}
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