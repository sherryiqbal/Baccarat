import { useState } from "react";

export default function BaccaratRevereCountTracker() {
  const cardValues = {
    "A": 0,
    "2": 1,
    "3": 2,
    "4": 2,
    "5": 4,
    "6": -2,
    "7": -3,
    "8": -4,
    "9": 0,
    "10": 0,
    "J": 0,
    "Q": 0,
    "K": 0
  };

  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [playerHistory, setPlayerHistory] = useState([]);
  const [bankerHistory, setBankerHistory] = useState([]);

  const [playerWins, setPlayerWins] = useState(0);
  const [bankerWins, setBankerWins] = useState(0);
  const [tieCount, setTieCount] = useState(0);
  const [totalHands, setTotalHands] = useState(0);
  const [playerPairs, setPlayerPairs] = useState(0);
  const [bankerPairs, setBankerPairs] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [loggedHands, setLoggedHands] = useState([]);

  const handleCardClick = (card, source) => {
    setCount((prev) => prev + cardValues[card]);
    setHistory((prev) => [...prev, `${source}: ${card}`]);

    if (source === "Player") {
      setPlayerHistory((prev) => [...prev, card]);
    } else if (source === "Banker") {
      setBankerHistory((prev) => [...prev, card]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastEntry = history[history.length - 1];
    const splitIndex = lastEntry.indexOf(": ");
    const source = lastEntry.slice(0, splitIndex);
    const card = lastEntry.slice(splitIndex + 2);

    setCount((prev) => prev - cardValues[card]);
    setHistory((prev) => prev.slice(0, -1));

    if (source === "Player") {
      setPlayerHistory((prev) => prev.slice(0, -1));
    } else if (source === "Banker") {
      setBankerHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleUndoPlayer = () => {
    if (playerHistory.length === 0) return;
    const lastCard = playerHistory[playerHistory.length - 1];
    setCount((prev) => prev - cardValues[lastCard]);
    setPlayerHistory((prev) => prev.slice(0, -1));
    setHistory((prev) => {
      const index = prev.lastIndexOf(`Player: ${lastCard}`);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const handleUndoBanker = () => {
    if (bankerHistory.length === 0) return;
    const lastCard = bankerHistory[bankerHistory.length - 1];
    setCount((prev) => prev - cardValues[lastCard]);
    setBankerHistory((prev) => prev.slice(0, -1));
    setHistory((prev) => {
      const index = prev.lastIndexOf(`Banker: ${lastCard}`);
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const handleSaveRound = () => {
    const playerPair = playerHistory.length >= 2 && playerHistory[0] === playerHistory[1];
    const bankerPair = bankerHistory.length >= 2 && bankerHistory[0] === bankerHistory[1];

    let winner = prompt("Enter round result (Player / Banker / Tie):");
    if (winner) winner = winner.trim().toLowerCase();

    if (winner === "player") {
      setPlayerWins((prev) => prev + 1);
      setLoggedHands((prev) => [...prev, "Player"]);
    } else if (winner === "banker") {
      setBankerWins((prev) => prev + 1);
      setLoggedHands((prev) => [...prev, "Banker"]);
    } else if (winner === "tie") {
      setTieCount((prev) => prev + 1);
      setLoggedHands((prev) => [...prev, "Tie"]);
    }

    if (playerPair) setPlayerPairs((prev) => prev + 1);
    if (bankerPair) setBankerPairs((prev) => prev + 1);

    setTotalHands((prev) => prev + 1);

    let hitOrMiss = prompt("Was this round a Hit or Miss? (Hit / Miss):");
    if (hitOrMiss) hitOrMiss = hitOrMiss.trim().toLowerCase();

    if (hitOrMiss === "hit") setHits((prev) => prev + 1);
    else if (hitOrMiss === "miss") setMisses((prev) => prev + 1);

    setCount(0);
    setHistory([]);
    setPlayerHistory([]);
    setBankerHistory([]);
  };

  const handleReset = () => {
    setCount(0);
    setHistory([]);
    setPlayerHistory([]);
    setBankerHistory([]);
  };

  const getLean = () => {
    if (count > 5) return "Player";
    if (count < -5) return "Banker";
    return "Neutral";
  };

  const cardOrder = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const getVisualBar = (count, total) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return `${"|".repeat(percentage / 5)} ${percentage}%`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", gap: "16px" }}>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", width: "100%" }}>
        <div style={{ maxWidth: "300px", flex: "1", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Player</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {cardOrder.map((card) => (
              <button
                key={`player-${card}`}
                onClick={() => handleCardClick(card, "Player")}
                style={{ width: "50px", height: "50px", fontSize: "16px", cursor: "pointer" }}
              >
                {card}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "16px" }}>
            <div>Selected: {playerHistory.join(", ")}</div>
            <div>Total: {playerHistory.length}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
            <button onClick={handleUndoPlayer} style={{ backgroundColor: "#e53e3e", color: "white", padding: "4px 8px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Erase Last Player Card</button>
          </div>
        </div>

        <div style={{ maxWidth: "300px", flex: "1", textAlign: "center", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600" }}>Current Count</h2>
          <div style={{ fontSize: "32px", fontWeight: "bold", margin: "12px 0" }}>{count}</div>
          <div style={{ fontSize: "18px" }}>Lean: {getLean()}</div>

          <button
            onClick={handleUndo}
            style={{ backgroundColor: "#3182ce", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginTop: "12px" }}
          >
            Undo Last Card
          </button>

          <button
            onClick={handleSaveRound}
            style={{ backgroundColor: "#38a169", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", marginTop: "12px" }}
          >
            Save Round
          </button>
        </div>

        <div style={{ maxWidth: "300px", flex: "1", padding: "16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>Banker</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {cardOrder.map((card) => (
              <button
                key={`banker-${card}`}
                onClick={() => handleCardClick(card, "Banker")}
                style={{ width: "50px", height: "50px", fontSize: "16px", cursor: "pointer" }}
              >
                {card}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "16px" }}>
            <div>Selected: {bankerHistory.join(", ")}</div>
            <div>Total: {bankerHistory.length}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
            <button onClick={handleUndoBanker} style={{ backgroundColor: "#e53e3e", color: "white", padding: "4px 8px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Erase Last Banker Card</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", textAlign: "center" }}>
        <div>Player: <span style={{ color: "blue" }}>{playerWins}</span></div>
        <div>Banker: <span style={{ color: "red" }}>{bankerWins}</span></div>
        <div>Tie: <span style={{ color: "green" }}>{tieCount}</span></div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", textAlign: "center" }}>
        <div>Player Pair: <span style={{ color: "blue" }}>{playerPairs}</span></div>
        <div>Banker Pair: <span style={{ color: "red" }}>{bankerPairs}</span></div>
        <div>Total Hands: {totalHands}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", textAlign: "center" }}>
        <div>Hits: {hits}</div>
        <div>Misses: {misses}</div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Logged Hands:</h3>
        <div>{loggedHands.join(" | ")}</div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Visual Stats:</h3>
        <div>Player: {getVisualBar(playerWins, totalHands)}</div>
        <div>Banker: {getVisualBar(bankerWins, totalHands)}</div>
        <div>Tie: {getVisualBar(tieCount, totalHands)}</div>
      </div>

      <button
        onClick={handleReset}
        style={{ backgroundColor: "#e53e3e", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
      >
        Reset Count
      </button>
    </div>
  );
}
