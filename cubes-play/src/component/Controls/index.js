import React, { Component } from "react";
import ControlField from "./ControlField";
import "./styled/index.css";

class Controls extends Component {
  onSubmit = e => {
    e.preventDefault();
  };

  render() {
    return (
      <div className="live-controls live-controls-container">
        <form className="live-controls-form" onSubmit={this.onSubmit}>
          <ControlField
            name="Camera"
            items={[
              { type: "range", label: "Camera X" },
              { type: "range", label: "Camera Y" },
              { type: "range", label: "Camera Z" }
            ]}
          />
        </form>
      </div>
    );
  }
}

export default Controls;
