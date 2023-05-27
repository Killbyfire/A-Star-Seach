import { useState } from "react";
import "./App.css";

function App() {
  const height = 50
  const width = 50;

  const colors = {0: '#fff', 1: '#000', 2: '#0091f7', 3: '#2c27d1'}

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

  return (
    <>
      <div>
        {tilesMap.map((row, rowIndex) => (
          <div key={rowIndex} style={{display: "flex", flexDirection: 'row'}}>
            {row.map((item, itemidx) => (
              <div key={itemidx} style={{width: width, height: height, borderColor: '#000', border: '2px solid black', backgroundColor: colors[item]}}></div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
