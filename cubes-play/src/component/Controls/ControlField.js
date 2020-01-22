import React, { Component } from "react";
import { CONTROL } from "../../constants/three";
import { Button } from "reactstrap";

const ControlItem = ({
  type,
  param,
  indexParent,
  indexChild,
  changeInputControl,
  onClickControl
}) => {
  return (
    <React.Fragment>
      {type === CONTROL.type.range && (
        <div className="form-group row">
          <label className="col-sm-2 col-form-label col-form-label-sm">
            {param.label}
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
              step={param.step}
              type="number"
              min={param.min}
              max={param.max}
              value={param.default}
              onChange={e => changeInputControl(indexParent, indexChild, e)}
            />
          </div>
        </div>
      )}
      {type === CONTROL.type.button && (
        <Button
          color={param.color}
          size="sm"
          onClick={() => onClickControl(indexParent, indexChild)}
          disabled={param.isDisabled}
        >
          {param.label}
        </Button>
      )}
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
      ...rest /* rest: indexParent, changeInputControl, onClickControl */
    } = this.props;
    const isOpenKlass = this.state.isOpen ? " is-open" : "";
    return (
      <fieldset className={`live-controls-${name.toLowerCase()}`}>
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
