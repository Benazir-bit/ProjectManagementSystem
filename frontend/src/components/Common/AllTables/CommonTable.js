import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
class CommonTable extends Component {
  render() {
    var dataColumns = this.props.data.columns;
    var dataRows = this.props.data.rows;
    //var link = this.props.link;
    var tableHeaders = (
      <thead>
        <tr>
          {dataColumns.map(function(column, index) {
            return <th key={index}>{column}</th>;
          })}
        </tr>
      </thead>
    );

    // var found = (col) =>
    // 	link.find(function(element) {
    // 		return col == element;
    // 	});

    var tableBody = dataRows.map(function(row, index) {
      return (
        <tr key={index}>
          {dataColumns.map(function(column, index) {
            return (
              <td key={index}>
                {row[column]}
                {/* {found(column) ? <Link>{row[column]}</Link> : row[column]} */}
              </td>
            );
          })}
        </tr>
      );
    });

    return (
      <Fragment>
        <div className={this.props.class_div}>
          <table className={this.props.clsattr} width={this.props.width}>
            {tableHeaders}
            <tbody>{tableBody}</tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}
export default CommonTable;
