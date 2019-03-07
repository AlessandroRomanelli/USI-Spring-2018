import React from "react";



export default class UserSummary extends React.Component {
	getFullName(user) {
		return user.firstName + " " + user.lastName;
	}

	getAge(user) {
		const now = new Date();
		const msInYear = 31536000000;
		return Math.floor((now -user.dateOfBirth)/msInYear);
	}

	getBirthday(user) {
		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];
		const date = user.dateOfBirth.getDate();
		const month = monthNames[user.dateOfBirth.getMonth()];
		const year = (user.showYear) ? " "+user.dateOfBirth.getFullYear() : "";
		return `${date} ${month}${year}`;
	}

	getLocation(user) {
		return user.city+", "+user.country;
	}

	render() {
		const { user } = this.props;
		return (
			<div className='user-info'>
				<h1>
					{this.getFullName(user)}
				</h1>
				<div>
					<span className='age'>
						<i className="fas fa-birthday-cake"></i>
						{this.getBirthday(user)}
					</span>
					<span className='location'>
						<i className="fas fa-map-pin"></i>
						{this.getLocation(user)}
					</span>
				</div>
			</div>
		);
	}
}
