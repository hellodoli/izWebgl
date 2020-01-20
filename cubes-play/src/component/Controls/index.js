import React, { Component } from "react";
import ControlField from "./ControlField";
import "./styled/index.css";

class Controls extends Component {
  onSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { controlItem, ...rest } = this.props;
    return (
      <div className="live-controls live-controls-container">
        <form className="live-controls-form" onSubmit={this.onSubmit}>
          {controlItem.length > 0 &&
            controlItem.map((control, i) => (
              <ControlField
                key={i}
                {...control} // control.name, control.items
                {...rest} // changeInputControl, destroy
                indexParent={i}
              />
            ))}
        </form>
      </div>
    );
  }
}

export default Controls;
