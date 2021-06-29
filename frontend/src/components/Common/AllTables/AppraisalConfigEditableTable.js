import React, { Component, Fragment } from "react";
import "./AppraisalEditableTable.css";
import CardBodyOnly from "../AllCard/CardBodyOnly";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  ConfigProvider,
  Icon,
  DatePicker,
  Popover,
  Checkbox,
  InputNumber
} from "antd";
const commnetsTitle = <span>Select Comments</span>;
const contentComment = (
  <div>
    <p>Check-in if you want to display comments in the form section.</p>
  </div>
);

const isMCQTitle = <span>Select MCQ</span>;
const contentIsMCQ = (
  <div>
    <p>Check-in if you want to select MCQ type section in the form.</p>
  </div>
);
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
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
    this.form = form_;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form_.getFieldDecorator(dataIndex + "_" + String(record.key), {
          rules: [
            {
              required: RegExp("_definition").test(dataIndex) ? false : true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <TextArea
            maxLength={255}
            ref={node => (this.input = node)}
            onBlur={this.save}
          />
          // <DatePicker onBlur={this.save} />
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

class AppraisalEditableTable extends Component {
  constructor(props) {
    super(props);
    // if (this.props.tabType === 1) {
    // ////console.log(
    //   `${this.props.dataSource.count_temp}_name`,
    //   "column testtttttttttttttttttttttttttttttt"
    // );
    this.columns = [
      {
        title: "Sl.",
        dataIndex: "sl",
        width: "7%",
        editable: false
      },
      {
        title: "Parameter Name",
        dataIndex: `${this.props.dataSource.count_temp}_name`,
        width: "20%",
        editable: true
      },
      {
        title: "Definition",
        dataIndex: `${this.props.dataSource.count_temp}_definition`,
        // width: "44%",
        editable: true
      },
      {
        title: "",
        width: "7%",
        dataIndex: `${this.props.dataSource.count_temp}_delete`,
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

    // } else {
    //   this.columns = null;
    // }

    this.state = {
      dataSource: [],
      isMCQ: this.props.dataSource.isMCQ,
      comments: this.props.dataSource.comment,
      maxMark: this.props.dataSource.maxMark,
      count: 0,
      columns: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    ////console.log("getDerivedStateFromProps", state.dataSource);
    let data_temp = [];
    // let state_dataSource = state.dataSource;
    // if (props.dataSource.parameter.length > 0) {
    //   props.dataSource.parameter.map((item, i) => {
    //     data_temp.push({
    //       // key: state.dataSource[i].key,
    //       // sl: state.dataSource[i].sl,
    //       // name: item_p.name,
    //       key: i,
    //       sl: i + 1,
    //       [`${props.dataSource.count_temp}_name`]: item.name,
    //       [`${props.dataSource.count_temp}_definition`]: item.definition
    //     });
    //   });
    // }
    // const data = data_temp;
    // const data =
    //   state.dataSource.length > 0
    //     ? data_temp
    //     : props.dataSource.parameter.length > 0
    //     ? props.dataSource.parameter
    //     : data_temp;

    const data =
      props.dataSource.parameter.length > 0 ? props.dataSource.parameter : [];
    ////console.log(
    //   props.dataSource.count_temp,
    //   "count_temp",
    //   data,
    //   "getDerivedStateFromProps testtt"
    // );
    // return { dataSource: data, columns: col };
    return { dataSource: data };
  }
  handleChecked(name, e) {
    ////console.log(e.target.checked, "check");
    this.setState({ [name]: e.target.checked });
    let data_new = [];
    this.state.dataSource.map((item, i) => {
      ////console.log(item, "testtttttt item");
      data_new.push({
        key: item.key,
        sl: i + 1,
        [`${this.props.dataSource.count_temp}_name`]: item[
          `${this.props.dataSource.count_temp}_name`
        ],
        [`${this.props.dataSource.count_temp}_definition`]: item[
          `${this.props.dataSource.count_temp}_definition`
        ],
        // name: item[`${this.props.dataSource.count_temp}_name`],
        // definition: item[`${this.props.dataSource.count_temp}_definition`],
        max_mark: form_.getFieldValue(
          `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
        ),
        is_mcq: name == "isMCQ" ? e.target.checked : this.state.isMCQ //form_.getFieldValue(`${this.props.index}_appraisal-table-is-mcq`)
      });
    });

    let data_return = {};
    data_return["id"] = this.props.dataSource.id
      ? this.props.dataSource.id
      : null;
    data_return["section_name"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-name`
    );
    data_return["definition"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-definition`
    );
    data_return["comment"] =
      name == "comments" ? e.target.checked : this.state.comments; //form_.getFieldValue(`${this.props.dataSource.count_temp}_appraisal-table-comment`);
    data_return["count_temp"] = this.props.dataSource.count_temp;
    data_return["parameter"] = data_new;
    // ////console.log(
    //   data_return,
    //   "data_return handleChecked before handleChangeData testtttttttt"
    // );
    this.props.onChange(this.props.index, data_return);
  }
  handleDelete = key => {
    ////console.log("data_return yes handle delete");
    const dataSource = [...this.state.dataSource];
    const data = dataSource.filter(item => item.key !== key);
    data.map((item, index) => (item.sl = index + 1));
    // this.setState({ dataSource: data });

    let data_new = [];
    ////console.log(data, "testtttttt ddata");
    data.map((item, i) => {
      ////console.log(item, "testtttttt item");
      data_new.push({
        key: item.key,
        sl: i + 1,
        [`${this.props.dataSource.count_temp}_name`]: item[
          `${this.props.dataSource.count_temp}_name`
        ],
        [`${this.props.dataSource.count_temp}_definition`]: item[
          `${this.props.dataSource.count_temp}_definition`
        ],
        // name: item[`${this.props.dataSource.count_temp}_name`],
        // definition: item[`${this.props.dataSource.count_temp}_definition`],
        max_mark: form_.getFieldValue(
          `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
        ),
        is_mcq: this.state.isMCQ //form_.getFieldValue(`${this.props.index}_appraisal-table-is-mcq`)
      });
    });
    // ////console.log(
    //   form_.getFieldValue(`${this.props.index}_appraisal-table-name`),
    //   "yesssssssss"
    // );
    let data_return = {};
    data_return["id"] = this.props.dataSource.id
      ? this.props.dataSource.id
      : null;
    data_return["section_name"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-name`
    );
    data_return["definition"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-definition`
    );
    data_return["comment"] = this.state.comments; //form_.getFieldValue(`${this.props.dataSource.count_temp}_appraisal-table-comment`);
    data_return["count_temp"] = this.props.dataSource.count_temp;
    data_return["parameter"] = data_new;
    ////console.log(
    //   data_return,
    //   "data_return handleDelete before handleChangeData testtttttttt"
    // );
    this.props.onChange(this.props.index, data_return);
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const count_val =
      this.state.dataSource.length > 0
        ? this.state.dataSource[this.state.dataSource.length - 1].key + 1
        : 0;

    const newData = {
      key: count_val,
      // key: dataSource.length,
      sl: dataSource.length + 1,
      [`${this.props.dataSource.count_temp}_name`]: "",
      [`${this.props.dataSource.count_temp}_definition`]: ""
    };
    // this.setState({
    //   dataSource: [...dataSource, newData]
    // });

    let temp_data = [...dataSource, newData];
    let data_new = [];
    temp_data.map((item, i) => {
      ////console.log(item, "testtttttt item");
      data_new.push({
        key: item.key,
        sl: i + 1,
        [`${this.props.dataSource.count_temp}_name`]: item[
          `${this.props.dataSource.count_temp}_name`
        ],
        [`${this.props.dataSource.count_temp}_definition`]: item[
          `${this.props.dataSource.count_temp}_definition`
        ],
        // name: item[`${this.props.dataSource.count_temp}_name`],
        // definition: item[`${this.props.dataSource.count_temp}_definition`],
        max_mark: form_.getFieldValue(
          `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
        ),
        is_mcq: this.state.isMCQ //form_.getFieldValue(`${this.props.index}_appraisal-table-is-mcq`)
      });
    });
    // ////console.log(
    //   form_.getFieldValue(`${this.props.index}_appraisal-table-name`),
    //   "yesssssssss"
    // );
    let data_return = {};
    data_return["id"] = this.props.dataSource.id
      ? this.props.dataSource.id
      : null;
    data_return["section_name"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-name`
    );
    data_return["definition"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-definition`
    );
    data_return["comment"] = this.state.comments; //form_.getFieldValue(`${this.props.dataSource.count_temp}_appraisal-table-comment`);
    data_return["count_temp"] = this.props.dataSource.count_temp;
    data_return["parameter"] = data_new;
    ////console.log(
    //   data_return,
    //   "data_return handleDelete before handleChangeData testtttttttt"
    // );
    this.props.onChange(this.props.index, data_return);
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.key === item.key);

    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row
    });
    ////console.log(
    //   this.props.dataSource.count_temp,
    //   newData,
    //   "testttttttttttttttttttttttttttttt",
    //   row
    // );

    // this.setState({ dataSource: newData });

    let data_return = {};
    let data_new = [];

    newData.map((item, i) => {
      ////console.log(item, "testtttttt item");
      data_new.push({
        key: item.key,
        sl: i + 1,
        [`${this.props.dataSource.count_temp}_name`]: item[
          `${this.props.dataSource.count_temp}_name`
        ],
        [`${this.props.dataSource.count_temp}_definition`]: item[
          `${this.props.dataSource.count_temp}_definition`
        ],
        // name: item[`${this.props.dataSource.count_temp}_name`],
        // definition: item[`${this.props.dataSource.count_temp}_definition`],
        max_mark: form_.getFieldValue(
          `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
        ),
        is_mcq: this.state.isMCQ //form_.getFieldValue(`${this.props.index}_appraisal-table-is-mcq`)
      });
    });
    // ////console.log(
    //   form_.getFieldValue(`${this.props.index}_appraisal-table-name`),
    //   "yesssssssss"
    // );
    data_return["id"] = this.props.dataSource.id
      ? this.props.dataSource.id
      : null;
    data_return["section_name"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-name`
    );
    data_return["definition"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-definition`
    );
    data_return["comment"] = this.state.comments; //form_.getFieldValue(`${this.props.dataSource.count_temp}_appraisal-table-comment`);
    data_return["count_temp"] = this.props.dataSource.count_temp;
    data_return["parameter"] = data_new;
    ////console.log(
    //   data_return,
    //   "data_return handleSave before handleChangeData testtttttttt"
    // );
    // this.setState({ dataSource: newData });
    this.props.onChange(this.props.index, data_return);
  };

  handleAppraisalName = () => {
    ////console.log("data_return handleAppraisalName");
    let data_return = {};
    data_return["id"] = this.props.dataSource.id
      ? this.props.dataSource.id
      : null;
    data_return["section_name"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-name`
    );
    data_return["definition"] = form_.getFieldValue(
      `${this.props.dataSource.count_temp}_appraisal-table-definition`
    );
    data_return["comment"] = this.state.comments; //form_.getFieldValue(`${this.props.dataSource.count_temp}_appraisal-table-comment`);
    data_return["count_temp"] = this.props.dataSource.count_temp;

    let data_new = [];
    if (this.state.dataSource.length > 0) {
      this.state.dataSource.map((item, i) => {
        data_new.push({
          key: item.key,
          sl: i + 1,
          [`${this.props.dataSource.count_temp}_name`]: item[
            `${this.props.dataSource.count_temp}_name`
          ],
          [`${this.props.dataSource.count_temp}_definition`]: item[
            `${this.props.dataSource.count_temp}_definition`
          ],
          max_mark: form_.getFieldValue(
            `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
          ),
          is_mcq: this.state.isMCQ //form_.getFieldValue(`${this.props.index}_appraisal-table-is-mcq`)
        });
      });
    }
    data_return["parameter"] = data_new;
    // data_return["parameter"] = data_new;
    ////console.log(
    // data_return,
    // "data_return handleAppraisalName before handleChangeData testtttttttt"
    // );
    // this.setState({ dataSource: newData });
    this.props.onChange(this.props.index, data_return);
    ////console.log(
    //   "afterrr",
    //   form_.getFieldValue(
    //     `${this.props.dataSource.count_temp}_appraisal-table-max-mark`
    //   )
    // );
  };

  render() {
    form_ = this.props.form;
    ////console.log(
    //   "lllll",
    //   this.props.dataSource.maxMark,
    //   form_.getFieldValue(`${this.props.dataSource.count_temp}_definition`)
    // );
    ////console.log(
    //   this.props.index,
    //   this.props.count,
    //   this.props.dataSource,
    //   this.state.dataSource,
    //   "draft features............"
    // );

    const { dataSource } = this.state;

    const config_table_name = {
      initialValue: this.props.dataSource.section_name,
      setFieldsValue: this.props.dataSource.section_name,
      rules: [
        {
          required: true,
          message: "Please Give The Section Name!"
        }
      ]
    };

    const config_table_definition = {
      initialValue: this.props.dataSource.definition,
      setFieldsValue: this.props.dataSource.definition,
      rules: [
        {
          required: false,
          message: "Please Give The Section Description!"
        }
      ]
    };

    const config_table_max_mark = {
      // initialValue: this.props.dataSource.maxMark,
      initialValue: this.state.maxMark,
      // setFieldsValue: 4,
      rules: [
        {
          required: true,
          message: "Please Give The Maximum Mark of This Section!"
        }
      ]
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    let table_col = [
      {
        title: "Sl.",
        dataIndex: "sl",
        width: "7%",
        editable: false
      },
      {
        title: "Parameter Name",
        dataIndex: `${this.props.dataSource.count_temp}_name`,
        width: "20%",
        editable: true
      },
      {
        title: "Definition",
        dataIndex: `${this.props.dataSource.count_temp}_definition`,
        // width: "44%",
        editable: true
      },
      {
        title: "",
        width: "7%",
        dataIndex: `${this.props.dataSource.count_temp}_delete`,
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
    const columns = table_col
      ? table_col.map(col => {
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
    ////console.log("ismcq", this.state.isMCQ, "comments", this.state.comments);
    return (
      <Fragment>
        <CardBodyOnly id={this.props.index}>
          <div style={{ margin: "20px" }}>
            <div>
              <Popconfirm
                title="Sure to delete this section?"
                onConfirm={() =>
                  this.props.handleDeleteSection(this.props.index)
                }
              >
                <Button
                  style={{ float: "right", position: "relative", zIndex: 99 }}
                  type="danger"
                >
                  Delete Section
                </Button>
              </Popconfirm>
            </div>
            <div>
              <Form.Item label="Section Name">
                {form_.getFieldDecorator(
                  `${this.props.dataSource.count_temp}_appraisal-table-name`,
                  config_table_name
                )(
                  // <Input />
                  <Input maxLength={255} onBlur={this.handleAppraisalName} />
                )}
              </Form.Item>
              <Form.Item label="Section Definition">
                {form_.getFieldDecorator(
                  `${this.props.dataSource.count_temp}_appraisal-table-definition`,
                  config_table_definition
                )(<Input maxLength={600} onBlur={this.handleAppraisalName} />)}
              </Form.Item>
              <Form.Item
                // label={"Comments"}
                label={
                  <span>
                    Comments{" "}
                    <Popover
                      placement="topLeft"
                      title={commnetsTitle}
                      content={contentComment}
                      arrowPointAtCenter
                    >
                      {/* <Icon type="info-circle"></Icon> */}
                    </Popover>
                  </span>
                }
              >
                <Checkbox
                  checked={this.state.comments}
                  onChange={e => this.handleChecked("comments", e)}
                >
                  True
                </Checkbox>
              </Form.Item>
              <Form.Item
                // label={"Comments"}
                label={
                  <span>
                    Is MCQ{" "}
                    <Popover
                      placement="topLeft"
                      title={isMCQTitle}
                      content={contentIsMCQ}
                      arrowPointAtCenter
                    >
                      {/* <Icon
                        type="info-circle"
                        // style={{ float: "right" }}
                      ></Icon> */}
                    </Popover>
                  </span>
                }
              >
                <Checkbox
                  checked={this.state.isMCQ}
                  onChange={e => this.handleChecked("isMCQ", e)}
                >
                  True
                </Checkbox>
              </Form.Item>
              <Form.Item label="Section Max Mark">
                {form_.getFieldDecorator(
                  `${this.props.dataSource.count_temp}_appraisal-table-max-mark`,
                  config_table_max_mark
                )(
                  <InputNumber
                    min={0}
                    step={1}
                    onBlur={this.handleAppraisalName}
                  />
                )}
              </Form.Item>
            </div>
            <ConfigProvider
              renderEmpty={customizeRenderEmpty}
              style={{ padding: "0px" }}
            >
              <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                // dataSource={dataSource.length > 0 ? dataSource : null}
                dataSource={this.state.dataSource}
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
            <br></br>
          </div>
        </CardBodyOnly>
      </Fragment>
    );
  }
}
export default AppraisalEditableTable;
