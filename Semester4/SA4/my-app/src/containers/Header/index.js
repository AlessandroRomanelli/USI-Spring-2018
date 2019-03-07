import React from "react";

import Clock from "../../elements/Clock";
import Login from "../../elements/Login";
// import SearchBar from "../../elements/SearchBar";
// import ProfileIcon from "../../elements/ProfileIcon";

export default class Header extends React.Component {
	render() {
		return (<header className='header'>
			<Clock/>
			<Login onClick={this.props.handleLogin}/>
			{/* <ProfileIcon onClick={this.props.handleLoadProfile}/>
			<SearchBar/> */}

		</header>);
	}
}
