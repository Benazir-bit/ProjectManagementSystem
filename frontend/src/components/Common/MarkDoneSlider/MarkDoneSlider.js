import React, { Fragment } from "react";
import { Slider, InputNumber, Row, Col } from "antd";
import "./MarkDoneSlider.css";
class MarkDoneSlider extends React.Component {
  state = {
    inputValue: 0
  };

  convertString = category => {
    return category.replace(/\s+/g, "_").toLowerCase();
  };

  onChange = value => {
    if (Number.isNaN(value)) {
      return;
    }
    this.props.onChangeSlider(this.convertString(this.props.category), value);
    this.setState({
      inputValue: value
    });
  };

  render() {
    const { inputValue } = this.state;
    return (
      <Fragment>
        <h5 id={"categoryHead"}>
          <b>{this.props.category}&nbsp;(10)</b>
        </h5>
        <Row>
          <Col xs={{ span: 16 }} id={"SliderSlide"}>
            <Slider
              min={0}
              max={10}
              onChange={this.onChange}
              value={inputValue}
              step={0.5}
            />
          </Col>
          <Col xs={{ span: 4 }} id={"SliderInput"}>
            <InputNumber
              min={0}
              max={10}
              step={0.5}
              value={inputValue}
              onChange={this.onChange}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default MarkDoneSlider;
