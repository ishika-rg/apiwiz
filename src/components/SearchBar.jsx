import PropTypes from 'prop-types';

const SearchBar = ({
  searchPath,
  setSearchPath,
  searchMessage,
  onSearch
}) => {
  return (
    <div className="search-section">
      <label>Search by JSON Path:</label>
      <div className="search-controls">
        <input
          type="text"
          value={searchPath}
          onChange={(e) => setSearchPath(e.target.value)}
          placeholder="e.g., $.user.address.city or products[0].name"
          className="search-input"
        />
        <button onClick={onSearch} className="btn-primary">
          Search
        </button>
      </div>
      {searchMessage && (
        <div className={`search-message ${searchMessage.includes('No match') ? 'not-found' : 'found'}`}>
          {searchMessage}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  searchPath: PropTypes.string.isRequired,
  setSearchPath: PropTypes.func.isRequired,
  searchMessage: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
