import { useState, useEffect, useRef, useCallback } from "react";

const API_URL = "http://localhost:5005/api";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of search component to close suggestions
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [goals, setGoals] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  // Fetch goals on component mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`${API_URL}/workouts/goals`);
        const data = await response.json();
        if (data.success) {
          setGoals(data.data);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (term) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (term.trim()) {
            handleSearch(term);
          }
        }, 300); // 300ms delay
      };
    })(),
    []
  );

  // Handle search term changes for suggestions and dynamic search
  useEffect(() => {
    setError("");
    if (searchTerm.trim()) {
      // Update suggestions
      const filtered = goals.filter((goal) =>
        goal.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);

      // Trigger debounced search
      debouncedSearch(searchTerm);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setWorkouts([]);
      setNoResults(false);
    }
  }, [searchTerm, goals, debouncedSearch]);

  const handleSearch = async (term) => {
    setError("");
    const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      setError("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setNoResults(false);
    setWorkouts([]);

    try {
      const response = await fetch(
        `${API_URL}/workouts/search?keyword=${encodeURIComponent(trimmedTerm)}`
      );
      const data = await response.json();

      if (response.status === 404) {
        setNoResults(true);
      } else if (!data.success) {
        setError(data.error || "An error occurred while searching");
      } else {
        setWorkouts(data.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search workouts. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
      setShowSuggestions(false);
    } else {
      setError("Please enter a search term");
    }
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search workouts by goal (e.g., weight loss, muscle gain)"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
            aria-label="Search workouts"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
            aria-activedescendant={
              selectedIndex > -1 ? `suggestion-${selectedIndex}` : undefined
            }
            role="combobox"
            autoComplete="off"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-md ${
              searchTerm.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Search
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            id="search-suggestions"
            className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
            role="listbox"
          >
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  id={`suggestion-${index}`}
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-4 py-2 flex items-center cursor-pointer text-gray-700
                    ${
                      index === selectedIndex
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                    }
                  `}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <svg
                    className={`h-4 w-4 mr-2 ${
                      index === selectedIndex
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {highlightMatch(suggestion, searchTerm)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Loading state */}
        {isSearching && (
          <div className="mt-4 text-center text-gray-600">Searching...</div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* No results message */}
        {noResults && !isSearching && !error && (
          <div className="mt-4 text-center text-gray-600">
            No workouts found for "{searchTerm}". Try a different goal.
          </div>
        )}
      </form>

      {/* Workout Results */}
      {workouts.length > 0 && !isSearching && !error && (
        <div className="mt-6 space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {workout.title}
              </h3>
              <p className="mt-1 text-gray-600">{workout.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {workout.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {goal}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-500">
                <span className="mr-4">
                  Duration: {workout.duration} minutes
                </span>
                <span>Difficulty: {workout.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
