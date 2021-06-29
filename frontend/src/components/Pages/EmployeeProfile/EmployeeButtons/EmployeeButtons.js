import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import AllButton from "../../../Common/AllButton/AllButton";

class EmployeeButtons extends Component {
  render() {
    let KPIButton;
    if (
      this.props.profile.user == this.props.user.id ||
      this.props.user.is_teamleader
    ) {
      KPIButton = (
        <tr>
          <td id="detail_button">
            <AllButton
              name={"View KPI"}
              btnhref={`/kpi-details/${this.props.profile.user}`}
              btnclassName={"btn btn-info"}
              id={"profile_button"}
            />
          </td>
        </tr>
      );
    }
    console.log(this.props.profile, "tttpp");
    return (
      <Fragment>
        <div className="col-md-5" id="employee_detail_div">
          <h4 style={{ textAlign: "center" }}>Links</h4>
          <table className="table" id="detail_table">
            <tbody>
              <tr>
                <td id="detail_button">
                  <AllButton
                    name={"Current Projects"}
                    btnhref={`/user/projects/ongoing/${this.props.profile.user}`}
                    btnclassName={"btn btn-info"}
                    id={"profile_button"}
                  />
                </td>
              </tr>
              <tr>
                <td id="detail_button">
                  <AllButton
                    name={"Current Tasks"}
                    btnhref={`/user/tasks/current/${this.props.profile.user}`}
                    btnclassName={"btn btn-warning"}
                    id={"profile_button"}
                  />
                </td>
              </tr>
              <tr>
                <td id="detail_button">
                  <AllButton
                    name={"Raised Issues (0)"}
                    btnhref={`/raised-issues/${this.props.profile.user}`}
                    btnclassName={"btn btn-danger"}
                    id={"profile_button"}
                  />
                </td>
              </tr>
              <tr>
                <td id="detail_button">
                  <AllButton
                    name={"Solved Issues"}
                    btnhref={`/solved-issues/${this.props.profile.user}`}
                    btnclassName={"btn btn-success"}
                    id={"profile_button"}
                  />
                </td>
              </tr>
              {KPIButton}
            </tbody>
          </table>
          <br />
        </div>
        <br />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});
export default connect(mapStateToProps)(EmployeeButtons);
