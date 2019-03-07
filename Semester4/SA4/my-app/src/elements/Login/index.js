import React from "react";

import UserContext from "../../context/User";

export default class Login extends React.Component {
	render() {
		return (
			<button className='logButton' onClick={this.props.onClick}>
				<UserContext.Consumer>
					{user => {return user ? "Logout" : "Login";}}
				</UserContext.Consumer>
			</button>);
	}
}
