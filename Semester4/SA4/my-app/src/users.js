const generateId = () => {
	return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
};

const populateFollowing = (user) => {
	const random = Math.floor(Math.random()*users.length);
	for (var i = 0; i < random; i++) {
		const j = Math.floor(Math.random()*users.length);
		const { id } = users[j];
		if (!(id in user.following) && id !== user.id) {
			user.following[id] = users[j];
		}
	}
};

const populateFollowers = (user) => {
	const random = Math.floor(Math.random()*users.length);
	for (var i = 0; i < random; i++) {
		const j = Math.floor(Math.random()*users.length);
		const { id } = users[j];
		if (!(id in user.followers) && id !== user.id) {
			user.followers[id] = users[j];
		}
	}
};

const users = [
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Alessandro",
		lastName: "Romanelli",
		dateOfBirth: new Date("02/18/1994"),
		profileImg: "https://scontent-amt2-1.xx.fbcdn.net/v/t31.0-8/13147330_10209315564276181_4950489799830647756_o.jpg?_nc_cat=111&_nc_ht=scontent-amt2-1.xx&oh=29c2da21d5cdcab7145fcd88d22e2ee4&oe=5D25F886",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam malesuada aliquam quam sed pulvinar. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
		city: "Lugano",
		country: "CH",
		showYear: true,
		following: {},
		followers: {},
	},
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Diego",
		lastName: "Carlino",
		dateOfBirth: new Date("02/18/1998"),
		profileImg: "http://atelier.inf.usi.ch/~carlid/wa1/img/diego.png",
		bio: "Phasellus a lobortis sem. Donec non pretium lorem. In hac habitasse platea dictumst. Integer sit amet ipsum ut elit dapibus faucibus. Curabitur feugiat rhoncus ullamcorper.",
		city: "Villa Guardia",
		country: "IT",
		showYear: false,
		following: {},
		followers: {},
	},
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Riccardo",
		lastName: "Corrias",
		dateOfBirth: new Date("11/16/1998"),
		profileImg: "http://atelier.inf.usi.ch/~corrir/wa1/img/home/profile.jpg",
		bio: "Vestibulum quis accumsan nibh, in tincidunt leo. Phasellus sed posuere nibh. Nullam magna nisi, volutpat id sapien eu, luctus iaculis felis.",
		city: "Lugano",
		country: "CH",
		showYear: true,
		following: {},
		followers: {},
	},
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Pasquale",
		lastName: "Polverino",
		dateOfBirth: new Date("10/23/1998"),
		profileImg: "http://atelier.inf.usi.ch/~polvep/img/12592391_604775783005832_4970522909455877852_n.jpg",
		bio: "Nam eu ligula rhoncus, tincidunt nisl pretium, vulputate metus. Maecenas ultricies ullamcorper magna. Duis rutrum ipsum sed ante ullamcorper convallis.",
		city: "Lugano",
		country: "CH",
		showYear: false,
		following: {},
		followers: {},
	},
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Lazar",
		lastName: "Najdenov",
		dateOfBirth: new Date("04/23/1997"),
		profileImg: "http://atelier.inf.usi.ch/~najdel/wa1/img/io.jpg",
		bio: "Nam eu ligula rhoncus, tincidunt nisl pretium, vulputate metus. Maecenas ultricies ullamcorper magna. Duis rutrum ipsum sed ante ullamcorper convallis.",
		city: "Lugano",
		country: "CH",
		showYear: true,
		following: {},
		followers: {},
	},
	{
		id: generateId(),
		displayName: "User"+Math.floor(Math.random()*10),
		firstName: "Michele",
		lastName: "Damian",
		dateOfBirth: new Date("02/11/1998"),
		profileImg: "http://atelier.inf.usi.ch/~damiam/wa1/img/thai2.jpg",
		bio: "Nam eu ligula rhoncus, tincidunt nisl pretium, vulputate metus. Maecenas ultricies ullamcorper magna. Duis rutrum ipsum sed ante ullamcorper convallis.",
		city: "Vacallo",
		country: "CH",
		showYear: true,
		following: {},
		followers: {},
	},
];

users.forEach(user => {
	populateFollowing(user);
	populateFollowers(user);
});

export default users;
