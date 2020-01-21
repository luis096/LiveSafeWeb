/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  InputGroup
} from "react-bootstrap";

function FieldGroup({
  label,
  addonLeft,
  addonRight,
  validationState,
  ...props
}) {
  if (addonLeft !== undefined || addonRight !== undefined)
    return (
      <InputGroup>
        {addonLeft ? <InputGroup.Addon>{addonLeft}</InputGroup.Addon> : ""}
        <FormControl {...props} />
        {addonRight ? <InputGroup.Addon>{addonRight}</InputGroup.Addon> : ""}
      </InputGroup>
    );
  return (
    <FormGroup validationState={validationState ? validationState : null}>
      {label ? <ControlLabel>{label}</ControlLabel> : ""}
      <FormControl {...props} />
      {validationState ? <FormControl.Feedback /> : ""}
    </FormGroup>
  );
}

export class FormInputs extends Component {
  render() {
    var row = [];
    for (var i = 0; i < this.props.ncols.length; i++) {
      row.push(
        <div key={i} className={this.props.ncols[i]}>
          <FieldGroup {...this.props.proprieties[i]} />
        </div>
      );
    }
    return <div className="row">{row}</div>;
  }
}

export default FormInputs;
