import { useEffect, useState } from "react";

export function MemoryGame() {
  const [gridSize, setGridSize] = useState(2);
  const [cards, setCards] = useState([]);
  const [maxMoves, setMaxMoves] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const intializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffleCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((num, index) => ({
        id: index,
        num,
      }));
    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setMoveCount(0);
    setMaxMoves(0);
  };

  useEffect(() => {
    intializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].num === cards[secondId].num) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };
  const handleClick = (id) => {
    if (disabled || won || (maxMoves > 0 && moveCount >= maxMoves)) return;

    if (flipped.length == 0) {
      setFlipped([id]);
      setMoveCount((prevCount) => prevCount + 1);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        setMoveCount((count) => count + 1);
        //check match logic
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };
  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);
  return (
    <>
      <h1 className="flex justify-center text-2xl font-bold">Memory Game</h1>
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div>
          {/* input */}
          <label htmlFor="gridSize"> Grid Size: (max 10)</label>
          <input
            type="number"
            className="border-2 border-gray-300 rounded px-2 py-1"
            id="gridSize"
            min="2"
            max="10"
            value={gridSize}
            onChange={handleSizeChange}
          />
          <label htmlFor="maxMoves" className="pl-3">
            Max Moves:{" "}
          </label>
          <input
            type="number"
            className="border-2 border-gray-300 rounded px-2 py-1"
            id="maxMoves"
            min="0"
            max="50"
            value={maxMoves}
            onChange={(e) => setMaxMoves(Number(e.target.value))}
          />
        </div>
        {maxMoves > 0 && (
          <p className="mt-4 text-xl text-red-600">
            {moveCount} / {maxMoves} Moves
            {moveCount >= maxMoves && (
              <p>You've reached the maximum number of moves</p>
            )}
          </p>
        )}
        <div
          className={`grid gap-2 mt-4`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
            width: `min(100%, ${gridSize * 5.5}rem)`,
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex justify-center items-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isFlipped(card.id) ? card.num : "?"}
            </div>
          ))}
        </div>
        {won && (
          <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
            {" "}
            You Won!
          </div>
        )}
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={intializeGame}
        >
          {won ? "play again" : "Reset"}
        </button>
      </div>
    </>
  );
}
