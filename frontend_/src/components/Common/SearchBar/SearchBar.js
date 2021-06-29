import React, { PureComponent, Fragment } from "react";
import { Select, Spin } from "antd";
const { Option } = Select;
export class SearchBar extends PureComponent {
  state = {
    userlist: []
  };
  componentDidUpdate() {
    this.setState({ userlist: this.props.userlist });
  }
  render() {
    return (
      <Fragment>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onSearch={this.props.onSearch}
          notFoundContent={this.props.fetching ? <Spin size="small" /> : null}
          showArrow={false}
          size="large"
          filterOption={(input, option) =>
            option.props.children.indexOf(input) >= 0
          }
        >
          {this.props.userlist.map((user, index) => (
            <Option key={index} value={user.username}>
              {user.full_name}
            </Option>
          ))}
        </Select>
      </Fragment>
    );
  }
}

export default SearchBar;
