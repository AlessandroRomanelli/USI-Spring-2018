import React from "react";

import Follower from "../Follower";

export default class Followers extends React.Component {
	render() {
		const { user } = this.props;
		const followers = Object.values(user.followers);
		if (followers.length === 0) {
			return <div className='followers'>
				<span className='heading'>No Followers</span>
			</div>;
		}
		return (<div className='followers'>
			<span className='heading'>Followers &mdash; {followers.length}</span>
			<div className='container'>
				{followers.map((follower, i) => {
					return <Follower key={i} user={follower} onClick={() => this.props.onClick(follower.id)}/>;
				})}
			</div>
		</div>);
	}
}
