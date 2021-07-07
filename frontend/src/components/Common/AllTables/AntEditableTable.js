import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./AllTable.css";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  ConfigProvider,
  Icon,
  DatePicker
} from "antd";
import moment from "moment";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = EditableRow;
const { TextArea } = Input;

let form_;
class EditableCell extends Component {
  state = {
    editing: true
  };

  save = e => {
    e.preventDefault();
    const { record, handleSave, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }

      const field = dataIndex + "_" + String(record.key);
      var body = {};
      if (dataIndex == "due_date") {
        body[dataIndex] = values[field].format("YYYY-MM-DD");
      } else {
        body[dataIndex] = values[field];
      }

      handleSave({ ...record, ...body });
    });
  };

  renderCell = form => {
    // this.form = form_;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form_.getFieldDecorator(dataIndex + "_" + String(record.key), {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue:
            dataIndex !== "due_date"
              ? record[dataIndex]
              : record[dataIndex]
                ? moment(record[dataIndex])
                : undefined
        })(
          dataIndex !== "due_date" ? (
            <TextArea ref={node => (this.input = node)} onBlur={this.save} />
          ) : (
            <DatePicker onBlur={this.save} format={"YYYY-MM-DD"} />
          )
        )}
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class AntEditableTable extends Component {
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
          editable: true
        },
        {
          title: "Description of Effort",
          dataIndex: "description_of_effort",
          width: "44%",
          editable: true
        },
        {
          title: "",
          dataIndex: "delete",
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                {/* <Icon type="delete" style={{ color: "red" }} /> */}
              </Popconfirm>
            ) : null
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
          editable: true
        },
        {
          title: "Description of Effort",
          dataIndex: "description_of_effort3",
          width: "44%",
          editable: true
        },
        {
          title: "",
          dataIndex: "delete",
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                {/* <Icon type="delete" style={{ color: "red" }} /> */}
              </Popconfirm>
            ) : null
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
          editable: true
        },
        {
          title: "Next Action",
          dataIndex: "next_action",
          // width: "44%",
          editable: true
        },
        {
          title: "Due Date",
          dataIndex: "due_date",
          // width: "44%",
          editable: true
        },
        {
          title: "",
          dataIndex: "delete",
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                {/* <Icon type="delete" style={{ color: "red" }} /> */}
              </Popconfirm>
            ) : null
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
          editable: true
        },
        {
          title: "Description of issue",
          dataIndex: "description_of_issue",
          width: "44%",
          editable: true
        },
        {
          title: "",
          dataIndex: "delete",
          render: (text, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                {/* <Icon type="delete" style={{ color: "red" }} /> */}
              </Popconfirm>
            ) : null
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataSource !== this.state.dataSource) {
      this.props.onChange(this.props.dataField, this.state.dataSource);
    }
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const data = dataSource.filter(item => item.key !== key);
    data.map((item, index) => (item.sl = index + 1));
    this.setState({ dataSource: data });
    this.props.onChange(this.props.dataField, data);
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const count_val =
      this.state.dataSource.length > 0
        ? this.state.dataSource[this.state.dataSource.length - 1].key + 1
        : 0;

    if (this.props.tabType === 1) {
      const newData = {
        key: count_val,
        sl: dataSource.length + 1,
        task: "",
        description_of_effort: ""
      };
      this.setState({
        dataSource: [...dataSource, newData]
        // count: count_val + 1
      });
    } else if (this.props.tabType === 3) {
      const newData = {
        key: count_val,
        sl: dataSource.length + 1,
        task3: "",
        description_of_effort3: ""
      };
      this.setState({
        dataSource: [...dataSource, newData]
        // count: count_val + 1
      });
    } else if (this.props.tabType === 2) {
      const newData = {
        key: count_val,
        sl: dataSource.length + 1,
        activities_in_progress: "",
        next_action: "",
        due_date: null
      };
      this.setState({
        dataSource: [...dataSource, newData]
        // count: count_val + 1
      });
    } else if (this.props.tabType === 4) {
      const newData = {
        key: count_val,
        sl: dataSource.length + 1,
        issue_name: "",
        description_of_issue: ""
      };
      this.setState({
        dataSource: [...dataSource, newData]
        // count: count_val + 1
      });
    }
  };

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
  };

  render() {
    form_ = this.props.form;
    const { dataSource } = this.state;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns
      ? this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave
          })
        };
      })
      : null;
    const customizeRenderEmpty = () => null;

    return (
      <div>
        <ConfigProvider
          renderEmpty={customizeRenderEmpty}
          style={{ padding: "0px" }}
        >
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource.length > 0 ? dataSource : null}
            columns={columns}
            pagination={false}
          />
        </ConfigProvider>

        {/* <Icon
          type="plus-square"
          onClick={this.handleAdd}
          className="add-custom"
        /> */}
        <br></br>
      </div>
    );
  }
}
export default AntEditableTable;
