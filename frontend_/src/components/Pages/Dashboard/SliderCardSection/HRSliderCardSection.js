import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Carousel, Icon, Skeleton } from "antd";
import SliderCard from "../../../Common/AllCard/SliderCard";
import "./SliderCardSection.css";

class SliderCardSection extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  render() {
    // if (!this.props.panel_data) {
    //   return null;
    // }
    const props = {
      infinite: false,
      speed: 500,
      slidesToShow: 3
      //slidesToScroll: 1
    };

    return (
      <Fragment>
        <div className="col-sm-12">
          <div className="ArrowDiv">
            {/* <Icon
              type="left-circle"
              style={{ fontSize: 22 }}
              onClick={this.previous}
            /> */}
          </div>
          <div className="CarouselDiv">
            <Carousel
              className="slider"
              dots={false}
              ref={node => (this.carousel = node)}
              {...props}
            >
              <SliderCard
                // IconImage={
                // 	"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                // }
                // IconTag={
                //   <Icon
                //     style={{
                //       fontSize: "50px",
                //       color: "rgb(92, 184, 92)"
                //     }}
                //     type="user-add"
                //   />
                // }
                slidertaskbtn={"sliderCard cnttask"}
                title={"Manage \n Members"}
                number={
                  this.props.panel_data ? (
                    this.props.panel_data.Manage_Members
                  ) : (
                    <Skeleton
                      active
                      loading={true}
                      paragraph={false}
                    ></Skeleton>
                  )
                }
                link={"/allmembers/all"}
              />
              <SliderCard
                // IconTag={
                //   <Icon
                //     style={{ fontSize: "50px", color: "#f0ad4e" }}
                //     type="user-add"
                //   />
                // }
                slidertaskbtn={"sliderCard NearingDeadline"}
                title={"Manage Groups"}
                number={this.props.user.groups.length}
                link={"/managegrp"}
              />

              <SliderCard
                // IconTag={
                //   <Icon
                //     style={{ fontSize: "50px", color: "#d9534f " }}
                //     type="notification"
                //   />
                // }
                slidertaskbtn={"sliderCard Overdue"}
                title={"Notice"}
                number={0}
                link={"/notices/onboard/"}
              />
              <SliderCard
                // IconTag={
                // <Icon
                //   style={{
                //     fontSize: "50px",
                //     color: "#5b3312"
                //   }}
                //   type="user-add"
                // />
                // }
                link={"/createuser"}
                slidertaskbtn={"sliderCard Unresolved"}
                title={"Create New User"}
              //number={this.props.panel_data.unresolved_issues}
              />
            </Carousel>
          </div>
          <div className="ArrowDiv">
            {/* <Icon
              style={{ fontSize: 22 }}
              type="right-circle"
              onClick={this.next}
            /> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  panel_data: state.profile.panel_data
});
export default connect(mapStateToProps)(SliderCardSection);
