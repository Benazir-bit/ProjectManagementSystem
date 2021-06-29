import "./Loader.css";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

class Loader extends Component {
  render() {
    return (
      <div className={this.props.loading ? "loading" : null}>
        {!this.props.loading ? this.props.children : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.loading.loading
});

export default connect(mapStateToProps)(Loader);
