import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { HumanVerification } from "./components/HumanVerification";


const App = () => {
  const [n, setN] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseInt(inputRef.current.value, 10);
    if (value >= 1 && value <= 1000) {
      setN(value);
      setSequence([]);
      setIsLoading(true);
    } else {
      alert("Veuillez entrer un nombre entre 1 et 1 000.");
    }
  };

  const fetchSequence = async () => {
    for (let i = 1; i <= n; i++) {
      try {
        const response = await axios.get("https://api.prod.jcloudify.com/whoami");
        setSequence((prev) => [...prev, `${i}. ${response.data.message || "Forbidden"}`]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setShowCaptcha(true);
          return;
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      fetchSequence();
    }
  }, [isLoading]);

  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
    setIsLoading(true);
  };

  return (
    <div className="app-container">
      {showCaptcha && <HumanVerification onSuccess={handleCaptchaSuccess} />}
      {!isLoading && !showCaptcha && (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            ref={inputRef}
            placeholder="Entrez un nombre (1-1000)"
            required
          />
          <button type="submit">Soumettre</button>
        </form>
      )}
      <ul>
        {sequence.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {isLoading && <p>Chargement...</p>}
    </div>
  );
};

export default App;
