import React, { Component, Fragment } from "react";
import { Table, Tag, Skeleton, Button, Icon } from "antd";
import ImageSmall from "../../Common/ImageSmall/ImageSmall";
import moment from "moment-timezone";
import UpdateAttendanceModal from "../../Common/Modals/UpdateAttendanceModal/UpdateAttendanceModal";

const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
class AttendanceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalData: null,
      allowable_date: 1,
      expandable: false
    };
  }

  hasExpandable = key => {
    const { attendance } = this.props;

    let today = moment().format("YYYY-MM-DD");
    let date_range = moment(today)
      .subtract(this.state.allowable_date, "days")
      .format("YYYY-MM-DD");

    if (this.props.selectionType == "group") {
      if (attendance[key].date >= date_range) {
        return true;
      } else {
        return false;
      }
    } else {
      if (attendance.attendance[key].date >= date_range) {
        return true;
      } else {
        return false;
      }
    }
  };

  showModal = item => {
    this.setState({
      visible: true,
      modalData: item
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      var form_item = {};
      form_item["date"] = moment(values.date).format("MMM DD, YYYY");
      form_item["in_time"] = moment(values.in_time).format("hh:mm a");
      form_item["out_time"] = moment(values.out_time).format("hh:mm a");
      form_item["remarks"] = values.remarks;
      console.log("Received values of form: ", form_item);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {}
      };
      return obj;
    };
    const columns = [
      {
        title: "Date",
        dataIndex: "date",
        align: "center",
        render: renderContent
      },
      {
        title: "Full Name",
        dataIndex: "full_name",
        align: "center",
        render: renderContent
      },
      {
        title: "First In",
        dataIndex: "in_time",
        align: "center",

        render: (value, row, index) => {
          var obj;
          if (value == null) {
            obj = {
              children: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),
              props: {}
            };
            return obj;
          } else if (value.type) {
            obj = {
              children: (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgba(0, 0, 0, 0.65)",
                    fontWeight: 600
                  }}
                >
                  {value.remarks}
                </div>
              ),
              props: {}
            };
            obj.props.colSpan = 4;
          } else {
            obj = {
              children: moment(value.in_time)
                .tz(Timezone)
                .format("LT"),
              props: {}
            };
          }
          return obj;
        }
      },
      {
        title: "Last Out",
        dataIndex: "out_time",
        align: "center",
        render: (value, row, index) => {
          var obj;
          if (value == null) {
            obj = {
              children: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),
              props: {}
            };
            return obj;
          } else if (value.type) {
            obj = {
              children: null,

              props: {}
            };
            obj.props.colSpan = 0;
          } else {
            obj = {
              children: value.out_time
                ? moment(value.out_time)
                  .tz(Timezone)
                  .format("LT")
                : null,
              props: {}
            };
          }
          return obj;
        }
      },
      {
        title: "Working Hours",
        dataIndex: "total_hours",
        align: "center",
        render: (value, row, index) => {
          var obj;
          if (value == null) {
            obj = {
              children: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),
              props: {}
            };
            return obj;
          } else if (value.type) {
            obj = {
              children: null,
              props: {}
            };
            obj.props.colSpan = 0;
          } else {
            obj = {
              children: value.total_hours,
              props: {}
            };
          }
          return obj;
        }
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        align: "center",
        render: (value, row, index) => {
          var obj;
          if (value == null) {
            obj = {
              children: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),
              props: {}
            };
            return obj;
          } else if (value.type) {
            obj = {
              children: null,
              props: {}
            };
            obj.props.colSpan = 0;
          } else if (!value.type) {
            obj = {
              children: (
                <span style={{ display: "inline-block" }}>
                  {value.remarks}
                  {/* {this.hasExpandable(index) ? (
                    <Button type="link" onClick={this.showModal(value)}>
                      <Icon type="edit" />
                    </Button>
                  ) : null} */}
                </span>
              ),
              props: {}
            };
          }
          return obj;
        }
      }
    ];

    let data = [];
    if (this.props.selectionType === "user") {
      this.props.attendance.attendance.map((item, i) => {
        data.push({
          key: i,
          date: (
            <Skeleton
              key={i}
              active
              loading={this.props.loading}
              paragraph={false}
            >
              <span>
                {this.hasExpandable(i) ? (
                  <Button type="link" onClick={() => this.showModal(item)}>
                    {/* <Icon
                      type="edit"
                      style={{
                        marginRight: "-10px",
                        marginLeft: "-5px",
                        paddingRight: "3px"
                      }}
                    /> */}
                  </Button>
                ) : (
                  <Button type="link"></Button>
                )}
                {moment(item.date).format("MMM DD, YYYY")}
              </span>

              {/* <span>
                <Button type="link" onClick={() => this.showModal(item)}>
                  <Icon
                    type="edit"
                    style={{
                      marginRight: "-10px",
                      marginLeft: "-5px",
                      paddingRight: "3px"
                    }}
                  />
                </Button>
                {moment(item.date).format("MMM DD, YYYY")}
              </span> */}
            </Skeleton>
          ),
          full_name: (
            <Skeleton active loading={this.props.loading} paragraph={false}>
              <div style={{ float: "left" }}>
                <ImageSmall
                  clsattr={"img-circle"}
                  altname={this.props.attendance.full_name}
                  srcfile={`http://192.168.10.158:8000${this.props.attendance.image}`}
                />
                <span>{this.props.attendance.full_name} </span>
              </div>
            </Skeleton>
          ),
          in_time: item,
          out_time: item,
          total_hours: item,
          remarks: item
        });
      });
    } else if (this.props.selectionType === "group") {
      if (this.props.attendance) {
        this.props.attendance.map((item, i) => {
          data.push({
            key: i,
            date: moment(item.attendance.date).format("MMM DD, YYYY"),
            full_name: (
              <div style={{ float: "left" }}>
                <ImageSmall
                  clsattr={"img-circle"}
                  altname={item.full_name}
                  srcfile={`http://192.168.10.158:8000${item.image}`}
                />
                <span>
                  {item.full_name}{" "}
                  {/* <sub style={{ color: "#aab6b9" }}>{item.group}</sub> */}
                </span>
              </div>
            ),

            in_time: item.attendance,
            out_time: item.attendance,
            total_hours: item.attendance,
            remarks: item.attendance
          });
        });
        if (this.props.loading) {
          for (let i = 0; i < this.props.limit; i++) {
            let skeleton_data = {
              key: this.props.attendance.length + i,
              date: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),
              full_name: (
                <Skeleton active loading={true} paragraph={false}></Skeleton>
              ),

              in_time: null,
              out_time: null,
              total_hours: null,
              remarks: null
            };
            data.push(skeleton_data);
          }
        }
      } else {
        for (let i = 0; i < this.props.limit; i++) {
          let skeleton_data = {
            key: i,
            date: <Skeleton active loading={true} paragraph={false}></Skeleton>,
            full_name: (
              <Skeleton active loading={true} paragraph={false}></Skeleton>
            ),

            in_time: null,
            out_time: null,
            total_hours: null,
            remarks: null
          };
          data.push(skeleton_data);
        }
      }
    }

    return (
      <Fragment>
        {this.props.selectionType === "user" ? (
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            expandIcon={this.expandIcon}
            rowClassName={this._getRowClassName}
            expandedRowRender={this.rowRender}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
          />
        )}
        <UpdateAttendanceModal
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          attendanceData={this.state.modalData}
        />
        &emsp; &emsp; &emsp; &emsp;
      </Fragment>
    );
  }
}

export default AttendanceTable;
