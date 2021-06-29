import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CompanyLogo.css";

class CompanyLogo extends Component {
  render() {
    return (
      <div className="Companylogo">
        <div id="company" className="navbar-brand">
          <strong>U</strong>LKASEMI
        </div>
        <p className="tagline">WE ARE INTEGRATING YOUR IDEAS</p>
      </div>
    );
  }
}

export default CompanyLogo;
