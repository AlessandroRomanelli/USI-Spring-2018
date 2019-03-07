import React from "react";


export default class UserGreeting extends React.Component {
	render() {
		return (<div className='greeting'>Hi, {this.props.user.displayName}!</div>);
	}
}
