import React from "react";

export default class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date()
		};
	}

	tick() {
		this.setState({ date: new Date() });
	}

	componentDidMount() {
		this.timer = setInterval(this.tick.bind(this), 1000);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	render() {
		const time = this.state.date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}).split(":");
		return (<div className='clock'>
			{time[0]}<span>:</span>{time[1]}
		</div>);
	}
}
