import React from "react";

export default class Footer extends React.Component {
	render() {
		return (<footer className='footer'>
			{new Date().getFullYear()} illUSIon &copy; All Rights Reserved.
		</footer>);
	}
}
