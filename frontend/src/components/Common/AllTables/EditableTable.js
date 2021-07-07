import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import "./EditableTable.css";
import { Icon, Input } from "antd";
import { Link } from "react-router-dom";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const initialState = {
  rows: [{}],
  dataEditable: [],
  amount: 0
  /* etc */
};
class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [{}],
      dataEditable: [],
      amount: 0
    };
  }

  // onDataSubmit = () => {
  // 	var other = {};
  // 	var k = 0;
  // 	var dataEditable = [];
  // 	var table_name = this.props.tabId;
  // 	var table = document.getElementById(table_name);
  // 	for (var i = 1, row; (row = table.rows[i]); i++) {
  // 		//iterate through rows
  // 		//rows would be accessed using the "row" variable assigned in the for loop
  // 		for (var j = 0, col; (col = row.cells[j]); j++) {
  // 			if (col.getElementsByTagName("input")[0]) {
  // 				if (j >= 1 || j <= row.cells.length - 2) {
  // 					other[
  // 						col.getElementsByTagName("input")[0].name
  // 					] = col.getElementsByTagName("input")[0].value;
  // 				}
  // 				if (j == row.cells.length - 2) {
  // 					dataEditable.push(other);
  // 					other = {};
  // 				}
  // 			}
  // 		}
  // 		if (i == table.rows.length - 1) {
  // 			this.props.setParentState(dataEditable);
  // 		}
  // 	}
  // };

  onDataSubmit = () => {
    var other = {};
    var k = 0;
    var dataEditable = [];
    var table_name = this.props.tabId;
    var table = document.getElementById(table_name);

    for (var i = 1, row; (row = table.rows[i]); i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      for (var j = 0, col; (col = row.cells[j]); j++) {
        if (col.getElementsByTagName("input")[0]) {
          other[
            col.getElementsByTagName("input")[0].name
          ] = col.getElementsByTagName("input")[0].value;
        }
      }
      dataEditable.push(other);
      other = {};
      if (i == table.rows.length - 1) {
        this.props.setParentState(dataEditable);
      }
    }
  };

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });

    var table_name = this.props.tabId;
    var table = document.getElementById(table_name);
    var amount = 0;
    for (var i = 1, row; (row = table.rows[i]); i++) {
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
      for (var j = 0, col; (col = row.cells[j]); j++) {
        if (col.getElementsByTagName("input")[0]) {
          if (col.getElementsByTagName("input")[0].name == "amount") {
            if (!parseFloat(col.getElementsByTagName("input")[0].value)) {
              col.getElementsByTagName("input")[0].value = 0;
            }
            amount =
              amount + parseFloat(col.getElementsByTagName("input")[0].value);
          }
        }
      }
    }

    var newValue = isNaN(amount) ? 0 : amount;
    this.props.amount(newValue);
  };

  handleAddRow = () => {
    const item = this.props.item;
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = idx => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });

    var table_name = this.props.tabId;
    var table = document.getElementById(table_name);
    var amount = 0;
    for (var i = 1, row; (row = table.rows[i]); i++) {
      if (i - 1 !== idx) {
        for (var j = 0, col; (col = row.cells[j]); j++) {
          if (col.getElementsByTagName("input")[0]) {
            if (col.getElementsByTagName("input")[0].name == "amount") {
              amount =
                amount + parseFloat(col.getElementsByTagName("input")[0].value);
            }
          }
        }
      }
    }

    var newValue = isNaN(amount) ? 0 : amount;
    this.props.amount(newValue);
  };

  initialState = () => {
    (this.state.rows = []),
      this.setState({
        //   rows: [{}],
        dataEditable: [],
        amount: 0
      });
  };
  render() {
    const data = this.props.data;
    const body = idx => {
      return data.map((data, i) => {
        if (data.body == "val") {
          return (
            <td key={i} className="text-center">
              {idx + 1}
            </td>
          );
        } else if (data.body == "input") {
          return (
            console.log(this.state.rows[idx][data.name], "ks"),
            (
              <td key={i} className="text-center">
                <input
                  type={data.type ? data.type : "text"}
                  step={data.step ? data.step : "any"}
                  name={data.name}
                  value={this.state.rows[idx][data.name]}
                  className="form-control"
                  onChange={this.handleChange(idx)}
                  required={
                    idx == 0 ? false : data.required ? data.required : true
                  }
                />
              </td>
            )
          );
        } else if (data.body == "") {
          return <td key={i} className="text-center" />;
        } else if (data.body == "textarea") {
          return (
            <td key={i} className="text-center">
              <textarea
                type="text"
                name={data.name}
                value={this.state.rows[idx][data.name]}
                className="form-control"
                onChange={this.handleChange(idx)}
              />
            </td>
          );
        } else if (data.body == "link") {
          return (
            <td key={i} className="text-center">
              <Link
                to={"#"}
                className="deletebtn"
                onClick={this.handleRemoveSpecificRow(idx)}
              >
                {/* <Icon type="delete" /> */}
              </Link>
            </td>
          );
        }
      });
    };

    const Items_header = data.map((data, i) => (
      <th key={i} className="text-center">
        {data.header}
      </th>
    ));

    const content = this.state.rows.map((item, idx) => (
      <tr id="addr0" key={idx}>
        {body(idx)}
      </tr>
    ));

    return (
      <div>
        <table className={this.props.clsattr} id={this.props.tabId}>
          {/* id="tab_logic" */}
          <thead>
            <tr>{Items_header}</tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
        {/* <Icon
          type="plus-square"
          onClick={this.handleAddRow}
          style={{ color: "#269abc", fontSize: "30px" }}
        /> */}
      </div>
    );
  }
}
export default EditableTable;
