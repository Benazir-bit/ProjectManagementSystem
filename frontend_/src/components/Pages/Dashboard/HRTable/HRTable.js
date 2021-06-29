import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import CommonTable from "../../../Common/AllTables/CommonTable";
import AllCardBody from "../../../Common/AllCard/AllCardBody";
import ImageSmall from "../../../Common/ImageSmall/ImageSmall";
import { Link } from "react-router-dom";
import { Button, Skeleton } from "antd";

class HRTable extends Component {
  render() {
    // if (!this.props.allgroup) {
    //   return null;
    // }
    let managegrp_list = [];
    if (!this.props.allgroup) {
      for (let i = 0; i < 3; i++) {
        let managleplp_object = {
          "Group Name": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),

          Teamleader: (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          ),
          "Total Members": (
            <Skeleton active loading={true} paragraph={false}></Skeleton>
          )
        };
        managegrp_list.push(managleplp_object);
      }
    } else {
      this.props.allgroup.map((group, j) => {
        let managleplp_object = {
          "Group Name": (
            <Link key={j} to={`/allmembers/${group.id}`}>
              {group.name}
            </Link>
          ),
          Teamleader: group.teamleader
            ? group.teamleader.teamleaders.map((teamleader, i) => (
                <Fragment key={i}>
                  <Link to={`/profile/${teamleader.profile.id}`}>
                    <ImageSmall
                      clsattr={"img-circle"}
                      altname={teamleader.profile.full_name}
                      srcfile={teamleader.profile.image}
                    />
                    {teamleader.profile.full_name}
                  </Link>
                  {i == group.teamleader.teamleaders.length - 1 ? null : ", "}
                </Fragment>
              ))
            : null,
          "Total Members": group.user_set.total_employees
        };
        managegrp_list.push(managleplp_object);
      });
    }
    var tableData = {
      columns: ["Group Name", "Teamleader", "Total Members"],
      rows: managegrp_list
    };
    return (
      <Fragment>
        <AllCardBody cardTitle={"All Groups"}>
          <CommonTable
            clsattr={"table dashboardCard"}
            data={tableData}
            class_div={"dashboard_task_table"}
          />
        </AllCardBody>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  allgroup: state.group.allgroup
});
export default connect(mapStateToProps)(HRTable);
