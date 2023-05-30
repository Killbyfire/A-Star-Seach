import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const height = 50;
  const width = 50;

  const colors = {
    0: "#fff",
    1: "#000",
    2: "#0091f7",
    3: "#2c27d1",
    4: "#0091f7",
    5: "#cf0000",
    6: "#43a047",
  };

  const goalTile = { row: 0, index: 0 };
  const startTile = { row: 3, index: 3 };

  // 0 is a empty tile.
  // 1 is a wall tile.
  // 2 is the start node.
  // 3 is the end node.
  // 4 is final path
  // 5 is the path it took.
  // ? 6 is neighbour?
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
          f: Fcost,
        });
      }
    });
    return tilesCosts;
  }

  // function Algorithm() {
  //   let currentPosition = startTile;
  //   for (let i = 0; i < tilesMap.length * tilesMap[0].length; i++) {
  //     let tiles = findNeighbours(currentPosition.row, currentPosition.index);
  //     let tileCosts = tiles.map((tile) => {
  //       return tile.f;
  //     });
  //     let lowestTileCost = Math.min(...tileCosts);
  //     let lowestTile = tiles[tileCosts.indexOf(lowestTileCost)];
  //     currentPosition = { row: lowestTile.row, index: lowestTile.index };
  //     tilesMap[lowestTile.row][lowestTile.index] = 5;
  //     if (
  //       currentPosition.row == goalTile.row &&
  //       currentPosition.index == goalTile.index
  //     ) {
  //       tilesMap.map((tileRow, RowIndex) => {
  //         tileRow.map((tile, idx) => {
  //           if (tile == 5) {
  //             tilesMap[RowIndex][idx] = 4;
  //           }
  //         });
  //       });
  //       break;
  //     }
  //  }
  function Algorithm() {
    let currentPosition = startTile;
    const algorithmLoop = setInterval(() => {
      let tiles = findNeighbours(currentPosition.row, currentPosition.index);
      let tileCosts = tiles.map((tile) => {
        return tile.f;
      });
      let lowestTileCost = Math.min(...tileCosts);
      let lowestTile = tiles[tileCosts.indexOf(lowestTileCost)];
      currentPosition = { row: lowestTile.row, index: lowestTile.index };
      console.log(currentPosition);
      const newTileMap = [...tilesMap];
      newTileMap[lowestTile.row][lowestTile.index] = 5;
      setTilesMap(newTileMap);
      if (
        currentPosition.row == goalTile.row &&
        currentPosition.index == goalTile.index
      ) {
        tilesMap.map((tileRow, RowIndex) => {
          tileRow.map((tile, idx) => {
            if (tile == 5) {
              tilesMap[RowIndex][idx] = 4;
            }
          });
        });
        clearInterval(algorithmLoop);
      }
    }, 1000);
  }

  useEffect(() => {
    Algorithm();
  }, [])

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
