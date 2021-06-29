import React, { Component } from "react";

class TitleHeader extends Component {
  render() {
    return (
      <div
        id="main_body_header"
        className="row"
        style={{ backgroundColor: this.props.title_color }}
      >
        <p>
          <b>{this.props.title}</b>
        </p>
      </div>
    );
  }
}
export default TitleHeader;
