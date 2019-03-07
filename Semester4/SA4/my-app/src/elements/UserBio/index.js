import React from "react";

export default class UserBio extends React.Component {
	render() {
		return (
			<div className='bio'>
				<span className='heading'>Bio</span>
				<p>{this.props.user.bio}</p>
			</div>
		);
	}
}
