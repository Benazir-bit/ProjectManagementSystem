import React, { Component, Fragment } from "react";
import AllCardHead from "../../../Common/AllCard/AllCardHead";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import GroupInfoTable from "../GroupInfoTable/GroupInfoTable";
import "./GroupInfo.css";
import GroupPieChart from "../GroupPieChart/GroupPieChart";
import { Skeleton } from "antd";
class GroupInfo extends Component {
  render() {
    return (
      <Fragment>
        <AllCardBody
          BodyId="grp_info_table"
          cardTitle={"Group Details"}
          cardHeight="dash_table_height_grp"
        >
          <GroupInfoTable
            group={this.props.group}
            // fetchingData={this.props.fetchingData}
          />
          <br />
          <AllCardHead
            cardHeadTitle="cardHeadTitle"
            cardTitle={"Current Task Overview"}
          />
          <GroupPieChart id={this.props.id} />
        </AllCardBody>
      </Fragment>
    );
  }
}
export default GroupInfo;
