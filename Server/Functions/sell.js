import fs from "fs";
import db from "../db.js";

function sell(req, res) {


    Object.keys(req.body).forEach(k => {
        if (!req.body[k]) return;
    });

    req.body.reviews = [];
    req.body.url = `/products/${req.body.id}`;

    let co = req.body.content.split(","), content = [];
    co.forEach(c => {
        content.push(c.trim());
    });

    req.body.content = content;
    req.body.seller = req.session.user.username;

    db.collection('products').insertOne(req.body);

    return res.redirect(`/products/${req.body.id}`);

}

export default sell;