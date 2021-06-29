import React, { Component } from "react";

class ImageSmall extends Component {
  render() {
    return (
      <img
        id={this.props.id}
        className={this.props.clsattr}
        width={30}
        height={30}
        src={this.props.srcfile}
        alt={this.props.altname}
      />
    );
  }
}
export default ImageSmall;
