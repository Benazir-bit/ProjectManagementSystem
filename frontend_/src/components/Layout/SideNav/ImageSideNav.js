import React, { Component } from "react";

class ImageSideNav extends Component {
  render() {
    return (
      <img
        id={this.props.id}
        className="img-sidenav-logo"
        width={this.props.width}
        height={this.props.height}
        src={this.props.srcfile}
        alt={this.props.altname}
      />
    );
  }
}
export default ImageSideNav;
