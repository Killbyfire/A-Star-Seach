import { useState } from "react";
import "./App.css";

function App() {
  const height = 50;
  const width = 50;

  const colors = { 0: "#fff", 1: "#000", 2: "#0091f7", 3: "#2c27d1" };

  // 0 is a empty tile.
  // 1 is a wall tile.
  // 2 is the start node.
  // 3 is the end node.
  const [tilesMap, setTilesMap] = useState([
    [0, 0, 3, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0],
  ]);

  function isNotBlocked(targetRow, targetIndex) {
    if (
      tilesMap[targetRow][targetIndex] !== 1 &&
      tilesMap[targetIndex][targetIndex] !== 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  function heuristic(startRow, startIndex, endRow, endIndex) {
    const across = 10;
    const diagonal = 14;
    const dx = Math.abs(startRow - endRow);
    const dy = Math.abs(startIndex - endIndex);
    return across * (dx + dy) + (diagonal - 2 * across) * Math.min(dx, dy);
  }

  function findNeighbours(startRow, startIndex, endRow, endIndex) {
    // Lets say i have 3,3
    // I need to get 2,2 | 2,3 | 2,4
    // I need to get 3,2 | 3,4
    // I need to get 4,2 | 4,3 | 4,4
    const neighboursScores = [];
    // Calculate G cost (distance from starting node)
    // Calculate H cost (distance from end node)
    // Calculate F cost (G + H)
  }

  console.log(findNeighbours(3, 3, 4, 4));

  console.log(heuristic(4, 4, 1, 1));

  return (
    <>
      <div>
        {tilesMap.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((item, itemidx) => (
              <div
                key={itemidx}
                style={{
                  width: width,
                  height: height,
                  borderColor: "#000",
                  border: "2px solid black",
                  backgroundColor: colors[item],
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
