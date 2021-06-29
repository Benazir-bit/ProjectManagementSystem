import React, { Component } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./AllTable.css";
import {
  Table,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
  ConfigProvider,
  Icon,
  DatePicker
} from "antd";
import moment from "moment";
import CardBodyOnly from "../AllCard/CardBodyOnly";
// import AddNewNoticeModal from "../Modals/AddNewNoticeModal/AddNewNoticeModal";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const { TextArea } = Input;
let maxMark;
let form_;
class EditableCell extends Component {
  state = {
    editing: true
  };

  save = e => {
    e.preventDefault();
    ////console.log("oooooooooooooooooooo", e);
    const { record, handleSave, dataIndex } = this.props;
    this.form.validateFields((error, values) => {
      ////console.log("aaaaaaaaaaaaaaaaa", e);
      //   ////console.log("save", e.currentTarget.id);
      //   ////console.log("save", e);
      //   ////console.log("save", error[e.currentTarget.id]);
      //   if (error && error[e.currentTarget.id]) {
      //     return;
      //   }
      ////console.log(this.props.record, "recorddddddddddddddd");

      const field = dataIndex + "_" + String(record.key);
      //   ////console.log("field-----", field);
      var body = {};
      // if (dataIndex == "due_date") {
      //   body[dataIndex] = values[field].format("YYYY-MM-DD");
      // } else {
      //   body[dataIndex] = values[field];
      // }
      body[dataIndex] = values[field];
      handleSave({ ...record, ...body });
    });
  };

  renderCell = form => {
    this.form = form_;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    // ////console.log(this.props, "propssssssssssssss");
    // ////console.log(this.state, "stateeeeeeeeeeeeeeeeeeeeeee");

    const regex = RegExp("_mark");
    // ////console.log(regex.test(dataIndex), "ttttttttttttttttt");
    let data_index_match = regex.test(dataIndex); //dataIndex.match(/_mark/)[0];
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form_.getFieldDecorator(dataIndex + "_" + String(record.key), {
          rules: [
            {
              required: dataIndex == "comment" ? false : true,
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
          // <Input ref={node => (this.input = node)} onBlur={this.save} />
          data_index_match !== true ? (
            <TextArea
              maxLength={1000}
              ref={node => (this.input = node)}
              onBlur={this.save}
            />
          ) : (
            <InputNumber
              type={"number"}
              ref={node => (this.input = node)}
              onBlur={this.save}
              step={1}
              // defaultValue={0}
              max={maxMark}
              min={0}
            />
            // <DatePicker onBlur={this.save} format={"YYYY-MM-DD"} />
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
    // if (this.props.dataSource.comment === true) {
    // this.columns = this.props.columns;
    this.columns = [
      {
        title: "Sl.",
        dataIndex: "sl",
        width: "7%",
        // editable: false,
        render: (value, row, index) => {
          const obj = {
            children: (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: 600
                }}
              >
                {value}
              </div>
            ),
            props: {}
          };

          return obj;
        }
      },
      {
        title: "Parameter",
        dataIndex: `${this.props.dataSource.count_temp}_name`,
        // width: "44%",
        editable: false,
        render: (value, row, index) => {
          var obj;
          obj = {
            children: (
              <div>
                <div
                  style={{
                    // textAlign: "center",
                    color: "rgba(0, 0, 0, 0.85)",
                    fontWeight: 600
                  }}
                >
                  {value.name}
                </div>
                <div
                  style={{
                    // textAlign: "center",
                    color: "rgba(0, 0, 0, 0.85)",
                    fontWeight: 400
                  }}
                >
                  {value.definition.trim().length > 0 ? (
                    <i>Definition: {value.definition.trim()}</i>
                  ) : null}
                </div>
              </div>
            ),
            props: {}
          };
          //   if (
          //     this.props.dataSource.edited === true &&
          //     this.props.dataSource.comment === true
          //   ) {
          //     // obj.props.rowSpan = this.state.dataSource;
          //     obj.props.colSpan = 1;
          //   } else if (
          //     this.props.dataSource.edited === false &&
          //     this.props.dataSource.comment === false
          //   ) {
          //     obj.props.colSpan = 3;
          //   } else obj.props.colSpan = 2;

          return obj;
        }
      },
      {
        title: `Score-Self (Out of ${this.props.dataSource.max_mark})`,
        //   this.props.dataSource.edited === true &&
        //   this.props.dataSource.comment === true
        //     ? `Marks (Out of ${this.props.dataSource.max_mark})`
        //     : "",
        dataIndex: `${this.props.dataSource.count_temp}_parameter_mark`,
        // width: "44%",
        editable: this.props.dataSource.edited ? true : false,
        render: (value, row, index) => {
          const obj = {
            children: (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: 600
                }}
              >
                {value}
              </div>
            ),
            props: {}
          };
          return obj;
        }
      },

      {
        title: "Average-Self",
        // this.props.dataSource.edited === true &&
        // this.props.dataSource.comment === true
        //   this.props.dataSource.edited === true &&
        //   this.props.dataSource.comment === true
        //     ? "Average"
        //     : this.props.dataSource.edited === false &&
        //       this.props.dataSource.comment === false
        //     ? `Marks (Out of ${this.props.dataSource.max_mark})`
        //     : this.props.dataSource.edited === false &&
        //       this.props.dataSource.comment === true
        //     ? "Average"
        //     : "Changes",
        dataIndex: `${this.props.dataSource.count_temp}_avg_mark`,
        // width: "44%",
        // editable: false
        render: (value, row, index) => {
          const obj = {
            children: (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: 600
                }}
              >
                {value}
              </div>
            ),
            props: {}
          };
          if (index === 0) {
            // obj.props.rowSpan = this.state.dataSource;
            obj.props.rowSpan = this.props.dataSource.perameter_set.length;
          } else obj.props.rowSpan = 0;

          return obj;
        }
      },
      {
        title: `Score-Others (Out of ${this.props.dataSource.max_mark})`, //this.props.dataSource.comment === true ? "Comments" : "Average",
        dataIndex: `${this.props.dataSource.count_temp}_parameter_mark_others`,
        // width: "44%",
        editable: false, //this.props.dataSource.edited ? true : false,
        render: (value, row, index) => {
          const obj = {
            children: (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: 600
                }}
              >
                {value}
              </div>
            ),
            props: {}
          };
          // if (this.props.dataSource.comment === true) {
          //   // obj.props.rowSpan = this.state.dataSource;
          //   obj.props.colSpan = 1;
          // } else obj.props.colSpan = 0;
          return obj;
        }
      },
      {
        title: "Average-Others",
        // this.props.dataSource.edited === true &&
        // this.props.dataSource.comment === true
        //   this.props.dataSource.edited === true &&
        //   this.props.dataSource.comment === true
        //     ? "Average"
        //     : this.props.dataSource.edited === false &&
        //       this.props.dataSource.comment === false
        //     ? `Marks (Out of ${this.props.dataSource.max_mark})`
        //     : this.props.dataSource.edited === false &&
        //       this.props.dataSource.comment === true
        //     ? "Average"
        //     : "Changes",
        dataIndex: `${this.props.dataSource.count_temp}_avg_mark_others`,
        // width: "44%",
        // editable: false
        render: (value, row, index) => {
          const obj = {
            children: (
              <div
                style={{
                  textAlign: "center",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontWeight: 600
                }}
              >
                {value}
              </div>
            ),
            props: {}
          };
          if (index === 0) {
            // obj.props.rowSpan = this.state.dataSource;
            obj.props.rowSpan = this.props.dataSource.perameter_set.length;
          } else obj.props.rowSpan = 0;

          return obj;
        }
      }
    ];
    // }
    // else if (this.props.dataSource.comment === false) {
    //   this.columns = [
    //     {
    //       title: "Sl.",
    //       dataIndex: "sl",
    //       width: "7%",
    //       // editable: false,
    //       render: (value, row, index) => {
    //         const obj = {
    //           children: (
    //             <div
    //               style={{
    //                 textAlign: "center",
    //                 color: "rgba(0, 0, 0, 0.85)",
    //                 fontWeight: 600
    //               }}
    //             >
    //               {value}
    //             </div>
    //           ),
    //           props: {}
    //         };

    //         return obj;
    //       }
    //     },
    //     {
    //       title: "Parameter",
    //       dataIndex: `${this.props.dataSource.count_temp}_name`,
    //       // width: "44%",
    //       editable: false,
    //       render: (value, row, index) => {
    //         var obj;
    //         obj = {
    //           children: (
    //             <div>
    //               <div
    //                 style={{
    //                   // textAlign: "center",
    //                   color: "rgba(0, 0, 0, 0.85)",
    //                   fontWeight: 600
    //                 }}
    //               >
    //                 {value.name}
    //               </div>
    //               <div
    //                 style={{
    //                   // textAlign: "center",
    //                   color: "rgba(0, 0, 0, 0.85)",
    //                   fontWeight: 400
    //                 }}
    //               >
    //                 <i>Definition: {value.definition}</i>
    //               </div>
    //             </div>
    //           ),
    //           props: {}
    //         };

    //         return obj;
    //       }
    //     },
    //     {
    //       title: "Marks",
    //       dataIndex: `${this.props.dataSource.count_temp}_parameter_mark`,
    //       // width: "44%",
    //       editable: this.props.noneditable ? false : true,
    //       render: (value, row, index) => {
    //         const obj = {
    //           children: (
    //             <div
    //               style={{
    //                 textAlign: "center",
    //                 color: "rgba(0, 0, 0, 0.85)",
    //                 fontWeight: 600
    //               }}
    //             >
    //               {value}
    //             </div>
    //           ),
    //           props: {}
    //         };
    //         return obj;
    //       }
    //     },
    //     {
    //       title: "Average",
    //       dataIndex: `${this.props.dataSource.count_temp}_avg_mark`,
    //       // width: "44%",
    //       // editable: false
    //       render: (value, row, index) => {
    //         const obj = {
    //           children: (
    //             <div
    //               style={{
    //                 textAlign: "center",
    //                 color: "rgba(0, 0, 0, 0.85)",
    //                 fontWeight: 600
    //               }}
    //             >
    //               {value}
    //             </div>
    //           ),
    //           props: {}
    //         };
    //         if (index === 0) {
    //           // obj.props.rowSpan = this.state.dataSource;
    //           obj.props.rowSpan = this.props.dataSource.perameter_set.length;
    //         } else obj.props.rowSpan = 0;

    //         return obj;
    //       }
    //     }
    //   ];
    // } else {
    //   this.columns = null;
    // }

    this.state = {
      sectionName: this.props.dataSource.name,
      sectionDefinition: this.props.dataSource.definition,
      isMCQ: this.props.dataSource.is_mcq,
      maxMark: this.props.dataSource.max_mark,
      dataSource: [],
      // dataSource_new: [],
      // tableID: "",
      count: 0
    };
  }

  static getDerivedStateFromProps(props, state) {
    ////console.log("sssssssss", props.dataSource);
    // const data =
    //   state.dataSource.length > 0
    //     ? state.dataSource
    //     : props.dataSource.length > 0
    //     ? props.dataSource.parameters
    //     : state.dataSource;
    // const data = props.dataSource.parameters;
    // let data = [];
    // props.dataSource.parameters.map((item, i) => {
    //   ////console.log("item..........: ", item);
    //   data.push({
    //     sl: i
    //   });
    // });
    // ////console.log("data....... ", data);
    // props.dataSource.parameters.map((item, i) => {
    //   let item_name = {};
    //   item_name["name"] = item.name;
    //   item_name["defination"] = item.defination;
    //   item_name;
    //   data.push({
    //     key: item.key,
    //     sl: item.sl,
    //     name: item_name,
    //     // defination: item.defination,
    //     mark: item.mark,
    //     avg_mark: props.dataSource.avg_mark,
    //     comment: item.comment
    //   });
    // });
    // const data =
    //   state.dataSource.length > 0
    //     ? state.dataSource
    //     : props.dataSource.perameter_set.length > 0
    //     ? props.dataSource.perameter_set
    //     : state.dataSource;
    const data =
      // state.dataSource.length > 0
      //   ? state.dataSource
      //   :
      props.dataSource.perameter_set.length > 0
        ? props.dataSource.perameter_set
        : [];
    ////console.log("field--data....... ", data);
    return { dataSource: data };
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.dataSource != this.state.dataSource) {
  //     ////console.log("componenetdidUpdate", this.state.dataSource);
  //     // this.props.onChange(this.props.dataField, this.state.dataSource);
  //     // let data_return = {};
  //     // let data = [];
  //     // ////console.log("return datasource", this.state.dataSource_new);
  //     // this.state.dataSource.map((item, i) => {
  //     //   // ////console.log("return item ", item.mark);
  //     //   data.push({
  //     //     key: item.key,
  //     //     sl: item.sl,
  //     //     name: item.name.name,
  //     //     defination: item.name.defination,
  //     //     mark: item.mark,
  //     //     avg_mark: item.avg_mark,
  //     //     comment: item.comment
  //     //   });
  //     // });
  //     // data_return["section_name"] = this.props.dataSource.section_name;
  //     // data_return["parameters"] = data;
  //     // this.props.onChange(this.props.dataField, data_return);
  //   }
  // }

  handleSave = row => {
    ////console.log("row.....", row);
    const newData = [...this.state.dataSource];

    const index = newData.findIndex(item => row.key === item.key);

    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row
    });

    // this.setState({ dataSource: newData });
    ////console.log("row new_data....", index, newData);
    // this.setState({ dataSource: newData });
    // this.setState({ dataSource_new: newData });
    let data_return = {};
    let data_new = [];
    // ////console.log("return datasource", this.state.dataSource_new);
    let avg_mark = 0;
    let avg_mark_others = 0;

    newData.map((item, i) => {
      avg_mark =
        avg_mark +
        Number(item[`${this.props.dataSource.count_temp}_parameter_mark`]);
      avg_mark_others =
        avg_mark_others +
        Number(
          item[`${this.props.dataSource.count_temp}_parameter_mark_others`]
        );
      // ////console.log("return item ", item.mark);
      data_new.push({
        id: this.props.dataSource.perameter_set[i].id,
        key: item.key,
        sl: item.sl,
        [`${this.props.dataSource.count_temp}_name`]: item[
          `${this.props.dataSource.count_temp}_name`
        ], //item.name.name,
        // [`${this.props.dataSource.count_temp}_name`]: item[`${this.props.dataSource.count_temp}_name`].definition, //item.name.definition,
        [`${this.props.dataSource.count_temp}_parameter_mark`]: item[
          `${this.props.dataSource.count_temp}_parameter_mark`
        ], // `${this.props.dataSource.count_temp}_mark` //item.mark,
        [`${this.props.dataSource.count_temp}_parameter_mark_others`]: item[
          `${this.props.dataSource.count_temp}_parameter_mark_others`
        ],
        // avg_mark: item.avg_mark,
        [`${this.props.dataSource.count_temp}_edited_text`]: item[
          `${this.props.dataSource.count_temp}_edited_text`
        ],
        [`${this.props.dataSource.count_temp}_comment`]: item[
          `${this.props.dataSource.count_temp}_comment`
        ] //item.comment
      });
    });
    let avg_mark_fix2 = avg_mark / newData.length;
    let avg_mark_fix2_others = avg_mark_others / newData.length;
    data_return["avg_mark"] = isNaN(avg_mark_fix2)
      ? "Section's All Score Not Given Yet"
      : avg_mark_fix2.toFixed(2);
    data_return["avg_mark_others"] = isNaN(avg_mark_fix2_others)
      ? "Section's All Score Not Given Yet"
      : avg_mark_fix2_others.toFixed(2);
    // this.state.dataSource.map((item, i) => {
    //   newData[i][`${this.props.dataSource.count_temp}_avg_mark`] =
    //     data_return["avg_mark"];
    // });
    this.state.dataSource.map((item, i) => {
      data_new[i][`${this.props.dataSource.count_temp}_avg_mark`] =
        data_return["avg_mark"];
      data_new[i][`${this.props.dataSource.count_temp}_avg_mark_others`] =
        data_return["avg_mark_others"];
    });

    ////console.log("ppppppppppppppp", avg_mark, newData.length);
    data_return["id"] = this.props.dataSource.id;
    data_return["name"] = this.props.dataSource.name;
    data_return["definition"] = this.props.dataSource.definition;
    data_return["comment"] = this.props.dataSource.comment;
    data_return["is_mcq"] = this.props.dataSource.is_mcq;
    data_return["max_mark"] = this.props.dataSource.max_mark;
    data_return["perameter_set"] = data_new;
    data_return["count_temp"] = this.props.dataSource.count_temp;
    // let avg_mark_fix2 = avg_mark / newData.length;
    // data_return["avg_mark"] = isNaN(avg_mark_fix2)
    //   ? "Section's All Score Not Given Yet"
    //   : avg_mark_fix2.toFixed(2);
    data_return["edited"] = this.props.dataSource.edited;
    // this.state.dataSource.map((item, i) => {
    //   newData[i][`${this.props.dataSource.count_temp}_avg_mark`] =
    //     data_return["avg_mark"];
    // });

    // this.setState({ dataSource: newData });
    ////console.log(data_return, "data_return appraisalSectionData");

    this.props.onChange(this.props.index, data_return);
  };

  render() {
    ////console.log(
    // "columns of  props",
    //   this.props.dataSource.edited,
    //   this.props.dataSource.comment
    // );
    ////console.log("data of props", this.props.dataSource);
    maxMark = this.state.maxMark;
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
      <CardBodyOnly>
        <div>
          <p
            style={{
              backgroundColor: "#18456b",
              margin: 0,
              padding: 7,
              textAlign: "center",
              color: "#fafafa"
            }}
          >
            {this.state.sectionName} {<br />}
            {this.state.sectionDefinition.trim().length > 0 ? (
              <i> ({this.state.sectionDefinition.trim()})</i>
            ) : null}
          </p>
          <ConfigProvider
            renderEmpty={customizeRenderEmpty}
            style={{ padding: "0px" }}
          >
            <Table
              // expandedRowRender={record => (
              //   <p style={{ margin: 0 }}>{record.description}</p>
              // )}
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
      </CardBodyOnly>
    );
  }
}
export default AntEditableTable;
