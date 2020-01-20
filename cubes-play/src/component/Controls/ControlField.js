import React, { Component } from "react";
import { CONTROL } from "../../constants/three";

import { ButtonGroup, Button } from "reactstrap";

const ControlItem = ({
  label,
  type,
  param,
  indexParent,
  indexChild,
  changeInputControl,
  color
}) => {
  return (
    <React.Fragment>
      {type === CONTROL.type.range && (
        <div className="form-group row">
          <label className="col-sm-2 col-form-label col-form-label-sm">
            {label}
          </label>
          <div className="col-sm-8">
            <input
              className="form-control form-control-sm"
              type="range"
              min={param.min}
              max={param.max}
              value={param.default}
              onChange={e => changeInputControl(indexParent, indexChild, e)}
            />
          </div>
          <div className="col-sm-2">
            <input
              className="form-control form-control-sm"
              type="text"
              min={param.min}
              max={param.max}
              value={param.default}
              onChange={e => changeInputControl(indexParent, indexChild, e)}
            />
          </div>
        </div>
      )}
      {type === CONTROL.type.button && <Button color={color}>{label}</Button>}
    </React.Fragment>
  );
};

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
    const {
      name,
      items,
      ...rest /* rest: indexParent, changeInputControl */
    } = this.props;
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
              items.map((item, i) => (
                <ControlItem key={i} {...item} {...rest} indexChild={i} />
              ))}
          </div>
        )}
      </fieldset>
    );
  }
}

export default ControlField;
