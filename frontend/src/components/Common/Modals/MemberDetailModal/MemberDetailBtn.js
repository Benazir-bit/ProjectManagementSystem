import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
import AllButton from "../../../Common/AllButton/AllButton";

class MemberDetailBtn extends Component {
  render() {
    return (
      <Fragment>
        <table className="table" id="detail_table">
          <tbody>
            <tr>
              <td id="detail_button">
                <AllButton
                  name={"Current Projects"}
                  btnhref={"/"}
                  btnclassName={"btn btn-info"}
                  id={"profile_button"}
                />
              </td>
            </tr>
            <tr>
              <td id="detail_button">
                <AllButton
                  name={"Current Tasks"}
                  btnhref={"/"}
                  btnclassName={"btn btn-warning"}
                  id={"profile_button"}
                />
              </td>
            </tr>
            <tr>
              <td id="detail_button">
                <AllButton
                  name={"Raised Issues (0)"}
                  btnhref={"/"}
                  btnclassName={"btn btn-danger"}
                  id={"profile_button"}
                />
              </td>
            </tr>
            <tr>
              <td id="detail_button">
                <AllButton
                  name={"Solved Issues"}
                  btnhref={"/"}
                  btnclassName={"btn btn-success"}
                  id={"profile_button"}
                />
              </td>
            </tr>
            <tr>
              <td id="detail_button">
                <AllButton
                  name={"View KPI"}
                  btnhref={"/"}
                  btnclassName={"btn btn-info"}
                  id={"profile_button"}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </Fragment>
    );
  }
}

export default MemberDetailBtn;
