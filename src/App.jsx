import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // TODO add user controls
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

  const [selectedTool, setSelectedTool] = useState("empty");
  const [AlgorithmWorking, setAlgorithmWorking] = useState(false);

  // 0 is a empty tile.
  // 1 is a wall tile.
  // 2 is the start node.
  // 3 is the end node.
  // 4 is final path
  // 5 is the path it took.
  // ? 6 is neighbour?
  const [startTile, setStartTile] = useState({ row: 4, index: 4 });
  const [goalTile, setGoalTile] = useState({ row: 1, index: 0 });
  const [tilesMap, setTilesMap] = useState([
    [0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2],
  ]);

  function GenerateTileMap(rows, columns) {
    let newTileMap = [];
    for (let i = 0; i < rows; i++) {
      let tileRow = [];
      for (let j = 0; j < columns; j++) {
        tileRow.push(0);
      }
      newTileMap.push(tileRow);
    }
    setTilesMap(newTileMap);
  }

  function isNotBlocked(targetNumber) {
    if (targetNumber !== 1 && targetNumber !== 2 && targetNumber !== 5) {
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
    if (typeof tilesMap[row - 1] !== "undefined") {
      tilesMap[row - 1].map((tile, tileIdx) => {
        [index - 1, index, index + 1].includes(tileIdx)
          ? topNeighbours.push({
              row: row - 1,
              index:
                index + ([index - 1, index, index + 1].indexOf(tileIdx) - 1),
              tile: tile,
            })
          : "";
      });
    }
    // For bottom neighbors
    if (typeof tilesMap[row + 1] !== "undefined") {
      tilesMap[row + 1].map((tile, tileIdx) => {
        [index - 1, index, index + 1].includes(tileIdx)
          ? bottomNeighbours.push({
              row: row + 1,
              index:
                index + ([index - 1, index, index + 1].indexOf(tileIdx) - 1),
              tile: tile,
            })
          : "";
      });
    }
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

  function Algorithm() {
    // TODO add showing the fastest path

    // !
    // ? Keep a list of neighbours so it checks all nodes neighbours and not just one node
    setAlgorithmWorking(true);
    let currentPosition = startTile;
    const algorithmLoop = setInterval(() => {
      let tiles = findNeighbours(currentPosition.row, currentPosition.index);
      let tileCosts = tiles.map((tile) => {
        return tile.f;
      });
      let lowestTileCost = Math.min(...tileCosts);
      let lowestTile = tiles[tileCosts.indexOf(lowestTileCost)];
      console.log(lowestTile);
      currentPosition = { row: lowestTile.row, index: lowestTile.index };
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
        setAlgorithmWorking(false);
        clearInterval(algorithmLoop);
      }
    }, 5000);
  }

  function getLowestValues(values) {
    const min = Math.min(...values);
    const lowestValues = [];

    values.map((value) => {
      if (value === min) {
        lowestValues.push(value)
      }
    })

    return lowestValues;
  }

  function AlgorithmRewrite() {
    const allNeighbours = [];
    // Get all neighbours and add to allNeighbours,
    // ! Get ALL lowest values and sort on H cost
    // ? loop over all neighbours and update ones
    setAlgorithmWorking(true);
    let currentPosition = startTile;
    const algorithmLoop = setInterval(() => {
      let tiles = findNeighbours(currentPosition.row, currentPosition.index);
      allNeighbours.push(...tiles);
      let tileCosts = allNeighbours.map((tile) => {
        return tile.f;
      });
      let lowestTiles = getLowestValues(tileCosts); // List of lowest values
      let lowestTile = lowestTiles[0];
      if (lowestTiles.length > 1) {
        let lowestTileHCost = 0;
        lowestTiles.map((lTile, lTileIdx) => {
          if (lTile.h > lowestTileHCost) {
            lowestTileHCost = lTile.h;
            lowestTile = lowestTiles[lTileIdx]
          }
        })
      }
      currentPosition = { row: lowestTile.row, index: lowestTile.index };
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
        setAlgorithmWorking(false);
        clearInterval(algorithmLoop);
      }
    }, 5000);
  }

  function clearTileMap() {
    const rows = tilesMap.length;
    const columns = tilesMap[0].length;
    GenerateTileMap(rows, columns);
  }

  function ClearFinished() {
    const newTileMap = [...tilesMap];
    let found = false;
    newTileMap.forEach((row, rowIdx) => {
      row.forEach((item, itemIdx) => {
        if (item == 4) {
          newTileMap[rowIdx][itemIdx] = 0;
          found = true;
        }
      });
    });
    if (found) {
      setTilesMap(newTileMap);
    }
  }

  function UpdatePosition(type, newRow, newIndex) {
    ClearFinished();
    if (AlgorithmWorking) {
      return;
    }
    const tools = { start: 2, goal: 3 };
    const newTileMap = [...tilesMap];
    newTileMap.forEach((row, rowIdx) => {
      row.forEach((item, itemIdx) => {
        if (item == tools[type]) {
          newTileMap[rowIdx][itemIdx] = 0;
        }
      });
    });
    newTileMap[newRow][newIndex] = tools[type];
    if (type == "start") {
      setStartTile({ row: newRow, index: newIndex });
    } else {
      setGoalTile({ row: newRow, index: newIndex });
    }
    setTilesMap(newTileMap);
  }

  function HandleClick(row, index) {
    ClearFinished();
    if (AlgorithmWorking) {
      return;
    }
    if (selectedTool == "start") {
      UpdatePosition("start", row, index);
      return;
    }
    if (selectedTool == "goal") {
      UpdatePosition("goal", row, index);
      return;
    }
    const tools = { empty: 0, wall: 1, start: 2, goal: 3 };
    const newTileMap = [...tilesMap];
    newTileMap[row][index] = tools[selectedTool];
    setTilesMap(newTileMap);
  }

  function handleHover(event, row, index) {
    if (AlgorithmWorking) {
      return;
    }
    const tools = { empty: 0, wall: 1, start: 2, goal: 3 };
    if (event.buttons == 1) {
      ClearFinished();
      if (selectedTool == "start") {
        UpdatePosition("start", row, index);
        return;
      }
      if (selectedTool == "goal") {
        UpdatePosition("goal", row, index);
        return;
      }
      const newTileMap = [...tilesMap];
      newTileMap[row][index] = tools[selectedTool];
      setTilesMap(newTileMap);
    }
  }

  useEffect(() => {
    GenerateTileMap(10, 15);
  }, []);

  return (
    <>
      <div>
        <h2>Current tool selected: {selectedTool}</h2>
        <button onClick={() => setSelectedTool("empty")}>Empty</button>
        <button onClick={() => setSelectedTool("wall")}>Wall</button>
        <button onClick={() => setSelectedTool("start")}>Start</button>
        <button onClick={() => setSelectedTool("goal")}>Goal</button>
        <br />
        <br />
        <button onClick={() => clearTileMap()}>Clear all</button>
        {/* form to enter delay, rows and columns */}
        {tilesMap.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((item, itemidx) => (
              <div
                key={itemidx}
                onMouseEnter={(e) => handleHover(e, rowIndex, itemidx)}
                onClick={() => HandleClick(rowIndex, itemidx)}
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
        <button onClick={() => Algorithm()} disabled={AlgorithmWorking}>
          Start algorithm
        </button>
      </div>
    </>
  );
}

export default App;
