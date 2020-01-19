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

const ControlField = props => {
  const { name, items } = props;

  return (
    <fieldset>
      <legend>
        {name} <i className="fas fa-chevron-down"></i>
      </legend>
      {items.length > 0 &&
        items.map(item => <ControlItem key={item.label} {...item} />)}
    </fieldset>
  );
};

export default ControlField;
