import bcrypt from "bcryptjs";
import db from "../db.js";

export default async function signup(req, res) {
	const {first_name, last_name, email, password} = req.body;
	const username = req.body.username.toLowerCase();
	const repeat = req.body['password_repeat'];

	Object.keys(req.body).forEach(k => {
		if (!req.body[k]) return res.redirect("/signup?invalid-credentials=true");
	});

	if (password !== repeat) return res.redirect('/signup?invalid-credentials=true');

	const usernameExists = await db.collection('users').findOne({username});
	const emailExists = await db.collection('users').findOne({email});

	if (!!usernameExists)
		return res.redirect('/signup?username-exists=true');

	if (!!emailExists)
		return res.redirect('signup?email-exists=true');

	const person = {
		firstName: first_name,
		lastName: last_name,
		username: username,
		profileImage: '//placehold.co/200x200/',
		profileBanner: '//placehold.co/500x200',
		createdTimestamp: Date.now(),
		email: email,
		password: bcrypt.hashSync(password, 8),
	}

	await db.collection('users').insertOne(person);

	res.redirect('/login');

}