import React, { Component } from "react";
import Main from "./container/Main";
import { WindowSizeContext } from "./context";

class App extends Component {
  render() {
    let { pdGap } = this.context;
    return (
      <WindowSizeContext.Provider value={this.context}>
        <div className="play-app" style={{ padding: `${pdGap * 100}%` }}>
          <Main />
        </div>
      </WindowSizeContext.Provider>
    );
  }
}

App.contextType = WindowSizeContext;
export default App;
