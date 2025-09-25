import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [input, setInput] = useState("");
  const [epsilon, setEpsilon] = useState("1.0");
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    try {
      const data = JSON.parse(input);
      // Upload with validation and privacy protection
      const response = await axios.post(
        `http://localhost:5000/upload?epsilon=${epsilon}`,
        data
      );
      if (response.data.error) {
        alert("Backend Error: " + response.data.error);
      } else {
        setResult(response.data);
      }
    } catch {
      alert("Invalid JSON or server error");
    }
  };

  const handleAdvancedAnonymize = async () => {
    try {
      const data = JSON.parse(input);
      const response = await axios.post(
        `http://localhost:5000/advanced_anonymize?epsilon=${epsilon}`,
        data
      );
      setResult(response.data);
    } catch {
      alert("Error in advanced anonymization API");
    }
  };

  return (
    <div>
      <h3>Upload Patient Data (Advanced Privacy)</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        cols={50}
      />
      <br />
      <label>
        Epsilon (Privacy level):{" "}
        <input
          type="number"
          min="0.1"
          max="10"
          step="0.1"
          value={epsilon}
          onChange={(e) => setEpsilon(e.target.value)}
          style={{ width: "60px" }}
        />
      </label>
      <br />
      <button onClick={handleUpload}>Upload With Validation & Privacy</button>
      <button onClick={handleAdvancedAnonymize} style={{ marginLeft: "10px" }}>
        Apply Advanced Privacy Only
      </button>

      {result && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "15px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default Upload;
