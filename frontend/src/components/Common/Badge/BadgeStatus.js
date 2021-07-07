import React, { Component } from 'react'

class BadgeStatus extends Component {
    render() {
        return (
            <p className={this.props.BadgeClass} style={{ backgroundColor: this.props.backgroundColor, width: this.props.width, marginLeft: this.props.marginLeft }}>{this.props.status}</p>
        )
    }
}
export default BadgeStatus
