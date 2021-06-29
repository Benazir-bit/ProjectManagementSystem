import React, { Component } from "react";

class ImageBig extends Component {
  render() {
    return (
      <img
        id={this.props.id}
        className={this.props.clsattr}
        width={200}
        height={200}
        src={this.props.srcfile}
        alt={this.props.altname}
      />
    );
  }
}
export default ImageBig;
