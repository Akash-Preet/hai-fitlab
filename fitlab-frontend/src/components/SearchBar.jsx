import { useState, useEffect, useRef } from "react";

const SUGGESTED_GOALS = [
  "weight loss",
  "muscle gain",
  "endurance",
  "strength",
  "flexibility",
  "cardio",
  "core strength",
  "balance",
];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);

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

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = SUGGESTED_GOALS.filter((goal) =>
        goal.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setError("");
    const trimmedTerm = term.trim();

    if (!trimmedTerm) {
      setError("Please enter a search term");
      return;
    }

    setIsSearching(true);
    setNoResults(false);

    // Simulated search delay - replace with actual API call
    setTimeout(() => {
      // Temporary: showing no results if search term doesn't match any suggested goals
      const hasResults = SUGGESTED_GOALS.some((goal) =>
        goal.toLowerCase().includes(term.toLowerCase())
      );
      setNoResults(!hasResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workouts by goal (e.g., weight loss, muscle gain)"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
            aria-label="Search workouts"
          />
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
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  {suggestion}
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
    </div>
  );
};

export default SearchBar;
