export default function SearchBar({ className, onSearch, query, setQuery }) {

  const handleQueryChange = (event) => {
    const { value } = event.target;
    setQuery(value);
  };

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className={`${className}`}>
      <label htmlFor="input" className="relative shadow-lg">
        <input
          name="input"
          type="text"
          placeholder="Search"
          className="w-full rounded-md shadow-md outline-none p-4 pl-12"
          value={query}
          onChange={handleQueryChange}
          onKeyUp={onKeyUp}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute top-1/2 transform -translate-y-1/2 left-3 fill-blue-400 h-6 w-6">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd" />
        </svg>
      </label>
    </div>
  );
}
