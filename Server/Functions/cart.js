import db from "../db.js";

export default async function cart(req, res) {
	if (!req.session.authenticated || !req.session.user)
		return res.send({error: true, errorCode: 401, success: false});

	res.clearCookie('cart', {path: '/'});

	req.body.forEach(item => {
		item.timestamp = (new Date()).toISOString().split('T')[0].split('-').reverse().join('-');
		item.user = req.session.user.username;
	});

	await db.collection('transactions').insertMany(req.body);
	res.send({error: false, success: true});
}