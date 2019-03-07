import React from "react";

export default class Avatar extends React.Component {
	render() {
		const { user } = this.props;
		return <div className='avatar'>
			<img src={user.profileImg} alt={user.displayName}/>
		</div>;
	}
}
