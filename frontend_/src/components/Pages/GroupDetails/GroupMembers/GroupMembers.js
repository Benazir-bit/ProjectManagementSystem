import React, { Component, Fragment } from "react";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import MemberTable from "../MemberTable/MemberTable";
import "./GroupMembers.css";

class GroupMembers extends Component {
  render() {
    return (
      <Fragment>
        <AllCardBody
          BodyId={"group_member_table"}
          cardTitle={"Members"}
          linkhref={"/uspl/group_members/1/"}
          id={"dashboard_viewproject"}
          view={"View All"}
        >
          <MemberTable group={this.props.group} />
        </AllCardBody>
      </Fragment>
    );
  }
}
export default GroupMembers;
