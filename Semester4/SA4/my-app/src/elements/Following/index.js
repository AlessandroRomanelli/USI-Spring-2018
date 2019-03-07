import React from "react";

import Follower from "../Follower";

export default class Followers extends React.Component {
	render() {
		const { user } = this.props;
		const following = Object.values(user.following);
		if (following.length === 0) {
			return (<div className='following'>
				<span className='heading'>No Following</span>
			</div>);
		}
		return (<div className='following'>
			<span className='heading'>{following.length} &mdash; Following</span>
			<div className='container'>
				{following.map((follower, i) => {
					return <Follower key={i} user={follower} onClick={() => this.props.onClick(follower.id)}/>;
				})}
			</div>
		</div>);
	}
}
