import React from "react";

export default class Follower extends React.Component {
	render() {
		const { user } = this.props;
		return <div className='follower' id={user.id} onClick={this.props.onClick}>
			<img src={user.profileImg} alt={user.displayName}/>
			<div>{user.firstName} {user.lastName}</div>
		</div>;
	}
}
