import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loadUser } from "../../../actions/auth";

export class Home extends Component {
  render() {
    return (
      <div className="col-sm-8" id="base-main-body">
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Page under construction</td>
                  <td>Page under construction</td>
                  <td>Page under construction</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

/*
const mapStateToProps = state => ({
  user: state.auth.user
});
*/

export default Home;
