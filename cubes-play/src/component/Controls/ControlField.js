import React, { Component } from "react";

const CONTROLTYPE = {
  range: "range"
};

const ControlItem = ({ label, type }) => (
  <div className="form-group row">
    <label className="col-sm-2 col-form-label col-form-label-sm">{label}</label>
    {type === CONTROLTYPE.range && (
      <React.Fragment>
        <div className="col-sm-8">
          <input className="form-control form-control-sm" type="range" />
        </div>
        <div className="col-sm-2">
          <input className="form-control form-control-sm" type="text" />
        </div>
      </React.Fragment>
    )}
  </div>
);

class ControlField extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  toggleControl = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  render() {
    const { name, items } = this.props;
    const isOpenKlass = this.state.isOpen ? " is-open" : "";
    return (
      <fieldset>
        <legend>
          <span>{name}</span>
          <span className={`icon${isOpenKlass}`} onClick={this.toggleControl}>
            <i className="fas fa-chevron-down"></i>
          </span>
        </legend>
        {this.state.isOpen && (
          <div>
            {items.length > 0 &&
              items.map(item => <ControlItem key={item.label} {...item} />)}
          </div>
        )}
      </fieldset>
    );
  }
}

export default ControlField;
