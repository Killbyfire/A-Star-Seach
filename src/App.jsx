import { useState } from "react";
import "./App.css";

function App() {
  const height = 50;
  const width = 50;

  const colors = { 0: "#fff", 1: "#000", 2: "#0091f7", 3: "#2c27d1", 5: "#cf0000" };

  const goalTile = { row: 0, index: 0 };
  const startTile = { row: 3, index: 3 };

  // 0 is a empty tile.
  // 1 is a wall tile.
  // 2 is the start node.
  // 3 is the end node.
  // 5 is the path it took.
  const [tilesMap, setTilesMap] = useState([
    [3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0],
    [0, 0, 0, 0, 0],
  ]);

  function isNotBlocked(targetNumber) {
    if (targetNumber !== 1 && targetNumber !== 2) {
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

  function findNeighbours(row, index) {
    let tilesCosts = [];
    // Lets say i have 3,3
    // I need to get 2,2 | 2,3 | 2,4
    // I need to get 3,2 | 3,4
    // I need to get 4,2 | 4,3 | 4,4
    // Calculate G cost (distance from starting node)
    // Calculate H cost (distance from end node)
    // Calculate F cost (G + H)
    let topNeighbours = [];
    const leftNeighbour = {
      row: row,
      index: index - 1,
      tile: tilesMap[row][index - 1],
    };
    const rightNeighbour = {
      row: row,
      index: index + 1,
      tile: tilesMap[row][index + 1],
    };
    let bottomNeighbours = [];
    // Idk how i figured this out but i did
    // For top neighbors
    tilesMap[row - 1].map((tile, tileIdx) => {
      [index - 1, index, index + 1].includes(tileIdx)
        ? topNeighbours.push({ row: index - 1, index: tileIdx, tile: tile })
        : "";
    });
    // For bottom neighbors
    tilesMap[row + 1].map((tile, tileIdx) => {
      [index - 1, index, index + 1].includes(tileIdx)
        ? bottomNeighbours.push({ row: index + 1, index: tileIdx, tile: tile })
        : "";
    });
    const neighbours = [
      ...topNeighbours,
      leftNeighbour,
      rightNeighbour,
      ...bottomNeighbours,
    ];
    neighbours.forEach((neighbour, neighbourIndex) => {
      const isAvailable = isNotBlocked(neighbour?.tile);
      if (isAvailable) {
        const Gcost = heuristic(
          neighbour?.row,
          neighbour?.index,
          startTile.row,
          startTile.index
        );
        const Hcost = heuristic(
          neighbour?.row,
          neighbour?.index,
          goalTile.row,
          goalTile.index
        );
        const Fcost = Gcost + Hcost;
        tilesCosts.push({
          row: neighbour?.row,
          index: neighbour?.index,
          g: Gcost,
          h: Hcost,
        });
      }
    });
    return tilesCosts;
  }

  function AStarAlgorithm() {}

  console.log(findNeighbours(3, 3));

  // console.log(heuristic(4, 4, 1, 1));

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
