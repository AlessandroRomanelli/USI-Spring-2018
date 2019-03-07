import React from "react";
import ReactDOM from "react-dom";
import "./stylesheets/style.sass";

import Greeting from "./containers/Greeting";
import Footer from "./containers/Footer";
import Header from "./containers/Header";
import Profile from "./containers/Profile";

import UserContext from "./context/User";

import users from "./users.js";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null,
			viewedUser: null
		};
	}

	handleLoadProfile(id) {
		const user = users.find(user => {
			return user.id === id;
		});
		if (user) {
			this.setState({
				viewedUser: user
			});
		}
	}

	handleLogin() {
		console.log(this);
		if (this.state.user) {
			return this.setState({
				user: null
			});
		}
		const randomUser = users[Math.floor(Math.random()*users.length)];
		return this.setState({
			user: randomUser,
			viewedUser: randomUser
		});
	}

	render() {
		let content = <React.Fragment/>;
		if (this.state.user) {
			content = <Profile
				viewedUser={this.state.viewedUser}
				handleLoadProfile={(id) => this.handleLoadProfile.bind(this)(id)}
			/>;
		}
		return (
			<div className='app'>
				<UserContext.Provider value={this.state.user}>
					<div className='container'>
						<Header
							handleLogin={this.handleLogin.bind(this)}
							handleLoadProfile={(id) => this.handleLoadProfile.bind(this)(id)}
						/>

						{/* <Greeting/> */}
						{content}
					</div>
					<Footer/>
				</UserContext.Provider>
			</div>
		);
	}
}

ReactDOM.render(
	<App/>,
	document.getElementById("root")
);
