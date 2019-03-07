import React from "react";

import Avatar from "../../elements/Avatar";
import UserSummary from "../../elements/UserSummary";
import UserBio from "../../elements/UserBio";
import Followers from "../../elements/Followers";
import Following from "../../elements/Following";
import Posts from "../../elements/Posts";
import Gallery from "../../elements/Gallery";

export default class Avatar extends React.Component {
	render() {
		const user = this.props.viewedUser;
		if (!user) {
			return <React.Fragment/>;
		}
		return (
			<div className='profile'>
				<React.Fragment>
					<Avatar user={user}/>
					<UserSummary user={user}/>
					<UserBio user={user}/>
					<Followers user={user} onClick={this.props.handleLoadProfile}/>
					<Following user={user} onClick={this.props.handleLoadProfile}/>
					<Posts user={user}/>
					<Gallery user={user}/>
				</React.Fragment>
			</div>);
	}
}
