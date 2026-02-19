import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>React + Node CI/CD + SonarCloud</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
