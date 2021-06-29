import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { connect } from "react-redux";
import { Table, Skeleton, Layout } from "antd";
import "./Email.css";
import DetailsModal from "./DetailsModal";
import TitleHeader from "../../Common/TitleHeader/TitleHeader";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
// Actions
import { fetchInboxData, resetInboxData } from "../../../actions/weeklyReport";
const { Content } = Layout;

class Email extends Component {
  state = {
    emailType: this.props.match.params.type == "inbox" ? "Sender" : "Recipient",
    title: this.props.match.params.type,
    pagination: {
      disabled: false,
      position: "top",
      pageSize: this.props.limit,
      total: this.props.count,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
      onChange: this.handleChange,
      current: 1
    }
  };

  UNSAFE_componentWillMount() {
    console.log("email UNSAFE_componentWillMount", this.props.offset);
    // this.props.resetInboxData();
    this.props.fetchInboxData(
      this.props.offset,
      this.props.limit,
      this.props.pageNumber,
      true,
      this.props.match.params.type
    );
  }
  componentDidUpdate(prevData) {
    console.log("componentDidUpdate", this.props.offset);
    if (this.props.count != prevData.count) {
      let total = this.props.count;
      this.setState({
        pagination: {
          disabled: false,
          position: "top",
          pageSize: this.props.limit,
          total: total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          onChange: this.handleChange,
          current: 1
        }
      });
    }
    if (prevData.match.params.type != this.props.match.params.type) {
      console.log("jooooooooooooooooooooooooooo", this.props.match.params.type);
      // this.props.resetInboxData();
      let total = this.props.count;
      this.setState({
        pagination: {
          disabled: false,
          position: "top",
          pageSize: this.props.limit,
          total: total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          onChange: this.handleChange,
          current: 1
        }
      });
      this.props.fetchInboxData(
        // this.props.offset,
        0,
        this.props.limit,
        1,
        // this.props.pageNumber,
        true,
        this.props.match.params.type
      );
    }
  }
  handleChange = (page, pageSize) => {
    console.log(
      page,
      "handleChange",
      "offset",
      this.props.offset,
      "limit",
      this.props.limit,
      "pageNumber",
      this.props.pageNumber
    );
    let total = this.props.count;
    this.setState({
      pagination: {
        disabled: false,
        position: "top",
        pageSize: this.props.limit,
        total: total,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        onChange: this.handleChange,
        current: page
      }
    });
    // console.log(this.props.pageNumber, "prev pageNumber");
    // const type = this.state.title.toLowerCase();
    if (this.props.pageNumber < page) {
      let offset = this.props.offset + this.props.limit;
      this.props.fetchInboxData(
        offset,
        this.props.limit,
        page,
        true,
        this.props.match.params.type
      );
    } else {
      let offset = this.props.offset - this.props.limit;
      this.props.fetchInboxData(
        offset,
        this.props.limit,
        page,
        false,
        this.props.match.params.type
      );
    }
  };

  // handleCard(record) {
  //   console.log(record.sender, "record obj.............");
  // }
  render() {
    console.log("dataaaaaaaaaaa", this.props.isLoading);
    const total = this.props.count;
    // const pagination = {
    //   position: "top",
    //   pageSize: this.props.limit,
    //   total: total,
    //   showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    //   onChange: this.handleChange
    // };
    let data_ = [];
    if (this.props.data && !this.props.isLoading) {
      let i = 0;
      let length = this.props.data.length;
      for (i = 0; i < length; i++) {
        let item = this.props.data[i];
        let status;
        if (item.gtype === "status") {
          if (item.report_type === "weekly") {
            status = (
              <Link to={`/weeklyreportsummary/${item.id}`}>
                Report Status For {item.week} Week
              </Link>
            );
          } else if (item.report_type === "monthly") {
            status = (
              <Link to={`/weeklyreportsummary/${item.id}`}>
                Report Status For Month {moment(item.month).format("MMM-YYYY")}
              </Link>
            );
          } else {
            status = (
              <Link to={`/weeklyreportsummary/${item.id}`}>
                Report Status From &nbsp;
                {moment(item.from_date).format("DD-MMM, YYYY")} to &nbsp;
                {moment(item.to_date).format("DD-MMM, YYYY")}
              </Link>
            );
          }
        } else if (item.gtype == "feedback" || item.gtype == "fdreply") {
          status = (
            <Link to={`/task-details/${item.task}`}>
              <p
                id="task-paragraph"
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            </Link>
          );
        }
        if (this.props.match.params.type == "inbox") {
          data_.push({
            key: i,
            date: [
              item.gtype == "status"
                ? item.timestamp
                : item.gtype == "feedback"
                ? item.created_date
                : item.gtype == "fdreply"
                ? item.timestamp
                : null
            ],
            status: [status],
            sender:
              item.gtype == "status"
                ? item.sender
                : item.gtype == "feedback"
                ? item.supervisor
                : item.gtype == "fdreply"
                ? item.target_user
                : null
          });
        } else if (this.props.match.params.type === "sent") {
          data_.push({
            key: i,
            date: [
              item.gtype == "status"
                ? item.timestamp
                : item.gtype == "feedback"
                ? item.created_date
                : item.gtype == "fdreply"
                ? item.timestamp
                : null
            ],
            status: [status],
            recipient:
              item.gtype == "status"
                ? item.recipent.concat(item.cc_list)
                : item.gtype == "feedback"
                ? [item.supervisor]
                : item.gtype == "fdreply"
                ? [item.target_user]
                : null
          });
        }
      }
    }
    if (this.props.isLoading) {
      let i = 0;
      if (this.props.match.params.type === "inbox") {
        for (i; i < this.props.limit; i++) {
          data_.push({
            key: i,
            date: null,
            status: null,
            sender: null
          });
        }
      } else if (this.props.match.params.type == "sent") {
        for (i; i < this.props.limit; i++) {
          data_.push({
            key: i,
            date: null,
            status: null,
            recipient: null
          });
        }
      }
    }
    var tableData = {
      columns: [
        {
          title: "Status",
          dataIndex: "status",
          width: "50%",
          render: text =>
            text ? text : <Skeleton loading={true} paragraph={false} />
        },
        {
          title:
            this.props.match.params.type == "inbox" ? "Sender" : "Recipient",
          dataIndex:
            this.props.match.params.type == "inbox" ? "sender" : "recipient",
          // ellipsis: true,
          width: "30%",
          align: "left",
          // height: "",
          render: (value, record) => {
            if (this.props.match.params.type == "inbox") {
              return value ? (
                <div>
                  <div className="email-col col-sm-11">
                    <Link to={`/profile/${value.id}`}>
                      <ImageSmall
                        clsattr={"img-circle"}
                        altname={value.full_name}
                        srcfile={value.image}
                      />{" "}
                      &nbsp;{value.full_name}
                    </Link>
                  </div>
                </div>
              ) : (
                <Skeleton
                  avatar={{ shape: "circle" }}
                  loading={true}
                  paragraph={false}
                />
              );
            } else if (this.props.match.params.type == "sent") {
              return value ? (
                <div className="email-col col-sm-11">
                  {value.map(user => (
                    <Link to={`/profile/${user.id}`}>
                      <ImageSmall
                        clsattr={"img-circle"}
                        altname={user.full_name}
                        srcfile={user.image}
                      />{" "}
                      &nbsp;{user.full_name}&nbsp;&nbsp;&nbsp;
                    </Link>
                  ))}
                </div>
              ) : (
                <Skeleton
                  avatar={{ shape: "circle" }}
                  loading={true}
                  paragraph={false}
                />
              );
            }
          }
        },
        {
          title: "Date",
          dataIndex: "date",
          width: "20%",
          render: value =>
            value ? (
              moment(value).format("MMM DD, YYYY, hh:MM A")
            ) : (
              <Skeleton active loading={true} paragraph={false} />
            )
        }
      ],
      rows: data_
    };
    console.log(this.props.data ? "false" : "true", "lgygygygg");
    return (
      <Fragment>
        <Content>
          <div className="col-sm-12" id="base-main-body">
            <div className="row">
              <div className="col-sm-12">
                <div id="main-body-div">
                  <br />
                  <TitleHeader
                    title={this.props.match.params.type}
                    title_color={"#337ab7"}
                  />
                  <br />
                  <span>
                    <div className="col-sm-12" style={{ padding: 0 }}>
                      {/* <DetailsModal /> */}
                      <Table
                        // {...this.state}
                        //loading={true}
                        // loading={this.props.data ? false : true}
                        pagination={
                          this.props.isLoading
                            ? { disabled: true, position: "top", showTotal: 0 }
                            : this.state.pagination
                        }
                        className="email"
                        id="email"
                        bordered
                        // pagination
                        columns={tableData.columns}
                        dataSource={tableData.rows}
                      />
                    </div>
                  </span>
                  <br />
                </div>
                <br />
                <br />
              </div>
            </div>
          </div>
        </Content>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, props) => (
  console.log(props, "llllllllllllllllllllllllllllll"),
  {
    isLoading: state.weeklyReport.isLoading,
    data:
      props.match.params.type == "inbox"
        ? state.weeklyReport.data_inbox
        : state.weeklyReport.data_sent,
    offset:
      props.match.params.type == "inbox"
        ? state.weeklyReport.offset_inbox
        : state.weeklyReport.offset_sent,
    limit:
      props.match.params.type == "inbox"
        ? state.weeklyReport.limit_inbox
        : state.weeklyReport.limit_sent,
    count:
      props.match.params.type == "inbox"
        ? state.weeklyReport.count_inbox
        : state.weeklyReport.count_sent,
    pageNumber:
      props.match.params.type == "inbox"
        ? state.weeklyReport.pageNumber_inbox
        : state.weeklyReport.pageNumber_sent
    // data: state.weeklyReport.data,
    // isLoading: state.weeklyReport.isLoading,
    // // props.match.params.type == "inbox"
    // //   ? state.weeklyReport.data_inbox
    // //   : state.weeklyReport.data_sent,
    // offset: state.weeklyReport.offset,
    // // props.match.params.type == "inbox"
    // //   ? state.weeklyReport.offset_inbox
    // //   : state.weeklyReport.offset_sent,
    // limit: state.weeklyReport.limit,
    // // props.match.params.type == "inbox"
    // //   ? state.weeklyReport.limit_inbox
    // //   : state.weeklyReport.limit_sent,
    // count: state.weeklyReport.count,
    // // props.match.params.type == "inbox"
    // //   ? state.weeklyReport.count_inbox
    // //   : state.weeklyReport.count_sent,
    // pageNumber: state.weeklyReport.pageNumber
    // // props.match.params.type == "inbox"
    // //   ? state.weeklyReport.pageNumber_inbox
    // //   : state.weeklyReport.pageNumber_sent
  }
);
export default connect(mapStateToProps, { fetchInboxData, resetInboxData })(
  Email
);
