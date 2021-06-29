import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Icon, Skeleton, Button, Badge } from "antd";
import "./MemberDetailModal.css";
import CommonTable from "../../AllTables/CommonTable";
import { ENGINE_METHOD_RAND } from "constants";

class MemberDetailInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: false
    };
  }
  componentDidMount() {
    this.setState({ fetchingData: false });
  }
  componentWillReceiveProps() {
    this.setState({ fetchingData: false });
  }
  render() {
    const { fetchingData } = this.state;

    var tableData = {
      columns: ["Title", "Item"],
      rows: [
        {
          Title: <b>ID</b>,
          Item: this.props.member_info.profile.username
        },
        {
          Title: <b>Email</b>,
          Item: this.props.member_info.profile.email
        },
        {
          Title: <b>Designation</b>,
          Item: this.props.member_info.profile.dsg
        },
        {
          Title: <b>Department</b>,
          Item:
            this.props.member_info.profile.groups.map((grp, i) => (
              <span key={i}>{grp.name} {i == (this.props.member_info.profile.groups.length - 1) ? null : ', '}</span>
            ))
        },
        {
          Title: <b>Date of Joining</b>,
          Item: this.props.member_info.profile.date_of_joining
        },
        {
          Title: <b>Current Status</b>,
          Item: this.props.member_info.profile.is_busy ?
            <Fragment>
              {/* <Icon
                type="thunderbolt"
                theme="filled"
                style={{ color: "#52c41a" }}
              /> <span> Busy</span> */}
              <span> Busy</span>
            </Fragment>
            :
            <Fragment>
              {/* <Icon
                type="thunderbolt"
                theme="outlined"
                style={{ color: "#aaa" }}
              /> */}
              <span> Idle</span>
            </Fragment>

        }
      ]
    };
    return (
      <Fragment>
        <CommonTable
          clsattr={"table AllMemInfo"}
          data={tableData}
          class_div={""}
        />
      </Fragment>
    );
  }
}

export default MemberDetailInfo;
