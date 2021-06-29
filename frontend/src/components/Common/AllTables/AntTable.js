import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./AntTable.css";
import { Table, Input, Form, ConfigProvider, DatePicker } from "antd";

let form_;

class AntTable extends Component {
  constructor(props) {
    super(props);
    if (this.props.tabType === 1) {
      this.columns = [
        {
          title: "Sl.",
          dataIndex: "sl",
          width: "7%",
          editable: false
        },
        {
          title: "Task",
          dataIndex: "task",
          width: "44%",
          editable: false
        },
        {
          title: "Description of Effort",
          dataIndex: "description_of_effort",
          width: "44%",
          editable: false
        }
      ];
    } else if (this.props.tabType === 3) {
      this.columns = [
        {
          title: "Sl.",
          dataIndex: "sl",
          width: "7%",
          editable: false
        },
        {
          title: "Task",
          dataIndex: "task3",
          width: "44%",
          editable: false
        },
        {
          title: "Description of Effort",
          dataIndex: "description_of_effort3",
          width: "44%",
          editable: false
        }
      ];
    } else if (this.props.tabType === 2) {
      this.columns = [
        {
          title: "Sl.",
          dataIndex: "sl",
          width: "7%",
          editable: false
        },
        {
          title: "Activities in Progress",
          dataIndex: "activities_in_progress",
          // width: "44%",
          editable: false
        },
        {
          title: "Next Action",
          dataIndex: "next_action",
          // width: "44%",
          editable: false
        },
        {
          title: "Due Date",
          dataIndex: "due_date",
          // width: "44%",
          editable: false
        }
      ];
    } else if (this.props.tabType === 4) {
      this.columns = [
        {
          title: "Sl.",
          dataIndex: "sl",
          width: "7%",
          editable: false
        },
        {
          title: "Issue Name",
          dataIndex: "issue_name",
          width: "44%",
          editable: false
        },
        {
          title: "Description of issue",
          dataIndex: "description_of_issue",
          width: "44%",
          editable: false
        }
      ];
    } else {
      this.columns = null;
    }

    this.state = {
      dataSource: [],

      count: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    const data =
      state.dataSource.length > 0
        ? state.dataSource
        : props.dataSource.length > 0
        ? props.dataSource
        : state.dataSource;
    return { dataSource: data };
  }

  handleSave = row => {
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.key === item.key);

    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row
    });
    var neww = newData.splice(index, 1, {
      ...item,
      ...row
    });

    this.setState({ dataSource: newData });
    this.props.onChange(this.props.dataField, newData);
  };

  render() {
    console.log(
      this.props.tabType,
      this.props.dataSource,
      "draft features............"
    );
    console.log(
      this.props.tabType,
      this.state.dataSource,
      "draft state features............"
    );
    form_ = this.props.form;
    const { dataSource } = this.state;

    const customizeRenderEmpty = () => null;

    return (
      <div>
        <ConfigProvider
          renderEmpty={customizeRenderEmpty}
          style={{ padding: "0px" }}
        >
          <Table
            // components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource.length > 0 ? dataSource : null}
            columns={this.columns}
            pagination={false}
          />
        </ConfigProvider>
      </div>
    );
  }
}
export default AntTable;
