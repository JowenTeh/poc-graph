export default function Suggestion({ className, suggestions, selectedSuggestions, onSelectedSuggestionsChange }) {
  const handleButtonClick = (event) => {
    const { value } = event.target;

    if (onSelectedSuggestionsChange) {
      if (selectedSuggestions.includes(value)) {
        onSelectedSuggestionsChange(selectedSuggestions.filter((s) => s !== value));
      } else {
        onSelectedSuggestionsChange([...selectedSuggestions, value]);
      }
      // onSelectedSuggestionsChange([value]);
    }
  };
  return (
    <div className={`${className}`}>
      {
        suggestions.map((suggestion) => (
          <button
            key={suggestion}
            // className={`bg-white rounded-full shadow-md text-sm px-4 py-1 mr-2 last:mr-0 hover:shadow-lg active:bg-blue-700 active:text-white ${selectedSuggestions.includes(suggestion) ? 'bg-blue-700 text-white' : ''}`}
            className={`bg-white rounded-full shadow-md text-xs font-medium px-4 py-1 mr-2 last:mr-0 mb-2 hover:shadow-lg active:bg-blue-700 active:text-white`}
            value={suggestion}
            onClick={handleButtonClick}
          >
            {suggestion}
          </button>
        ))
      }
    </div>
  );
}
