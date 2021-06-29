import React, { Component } from "react";

class ImageMedium extends Component {
  render() {
    return (
      <img
        id={this.props.id}
        // className="img-sidenav-logo"
        className={this.props.clsattr}
        width={70}
        height={70}
        src={this.props.srcfile}
        alt={this.props.altname}
      />
    );
  }
}
export default ImageMedium;
