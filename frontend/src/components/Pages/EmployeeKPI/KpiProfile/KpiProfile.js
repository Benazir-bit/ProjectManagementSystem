import React, { Component } from "react";
import { Card } from "antd";
import ImageBig from "../../../Common/ImageBig/ImageBig";
import "./KpiProfile.css";
// import { runInThisContext } from "vm";
// const { Meta } = Card;

export class KpiProfile extends Component {
  render() {
    return (
      <div>
        <Card
          hoverable
          cover={
            <center>
              <ImageBig alt="example" srcfile={this.props.user.image} />
            </center>
          }
          id="kpi_profile_card"
        >
          <table className="table table-hover" id="kpiCategory">
            <tbody>
              <tr>
                <td id="member_grp">
                  <b>Year</b>
                </td>
                <td id="grp_description">  {this.props.yearFilter}</td>

              </tr>
              <tr>
                <td id="member_grp">
                  <b>Assisted Projects</b>
                </td>
                <td id="grp_description">{this.props.projects}</td>
              </tr>
              <tr>
                <td id="member_grp">
                  <b>Completed Tasks</b>
                </td>
                <td id="grp_description">{this.props.tasks}</td>
              </tr>
              <tr>
                <td id="member_grp">
                  <b>Raised Issues</b>
                </td>
                <td id="grp_description">{this.props.raised_issues}</td>
              </tr>
              <tr>
                <td id="member_grp">
                  <b>Solved Issues</b>
                </td>
                <td id="grp_description">{this.props.solved_issues}</td>
              </tr>

            </tbody>
          </table>
        </Card>
      </div>
    );
  }
}

export default KpiProfile;
