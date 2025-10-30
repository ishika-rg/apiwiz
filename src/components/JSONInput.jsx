import PropTypes from 'prop-types';

const JSONInput = ({
  jsonInput,
  setJsonInput,
  error,
  onVisualize,
  onClear,
  onReset
}) => {
  return (
    <div className="input-section">
      <div className="input-header">
        <label>JSON Input:</label>
        <div className="input-buttons">
          <button onClick={onReset} className="btn-secondary">
            Reset to Sample
          </button>
          <button onClick={onClear} className="btn-secondary">
            Clear All
          </button>
        </div>
      </div>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here..."
        rows={10}
        className="json-input"
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={onVisualize} className="btn-primary">
        Generate Tree
      </button>
    </div>
  );
};

JSONInput.propTypes = {
  jsonInput: PropTypes.string.isRequired,
  setJsonInput: PropTypes.func.isRequired,
  error: PropTypes.string,
  onVisualize: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default JSONInput;
