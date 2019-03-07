import React from "react";

import UserGreeting from "./user.js";
import GuestGreeting from "./guest.js";
import UserContext from "../../context/User";

export default class Greeting extends React.Component {
	render() {
		return (
			<UserContext.Consumer>
				{user => (user ? (<UserGreeting user={user}/>) : (<GuestGreeting/>))}
			</UserContext.Consumer>);
	}
}
