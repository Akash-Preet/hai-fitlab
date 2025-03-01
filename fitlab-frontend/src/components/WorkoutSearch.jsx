import SearchBar from "./SearchBar";

const WorkoutSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Find Your Perfect Workout
        </h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default WorkoutSearch;
