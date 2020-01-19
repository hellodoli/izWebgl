import React from "react";
import Controls from "./component/Controls";
import Cubes from "./component/Cubes";

function App() {
  return (
    <div className="cubes-play-app">
      <Controls />
      <Cubes />
    </div>
  );
}

export default App;
