import db from "../db.js";
import bcrypt from "bcryptjs";

export default async function login(req, res) {

	if (req.session.authenticated)
		return res.redirect('/?already-logged-in=true');

	const {password} = req.body;
	const username = req.body.username.toLowerCase();

	if (!username || !password) return res.redirect('/login?invalid-credentials=true');

	const user = await db.collection('users').findOne({username});
	if (!user) return res.redirect('/login?invalid-user=true');

	const correctPassword = bcrypt.compareSync(password, user.password);
	if (!correctPassword) return res.redirect('/login?invalid-user=true');

	delete user.password;

	req.session.authenticated = true;
	req.session.user = user;
	res.redirect('/?logged-in=true');

}