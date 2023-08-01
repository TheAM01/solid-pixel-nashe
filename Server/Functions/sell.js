import fs from "fs";

function sell(req, res, dir) {

    console.log(req.body);
    Object.keys(req.body).forEach(k => {
        if (!req.body[k]) return
    });

    req.body.reviews = [];
    req.body.url = `/products/${req.body.id}`;

    let co = req.body.content.split(","), content = [];
    co.forEach(c => {
        content.push(c.trim());
    });

    req.body.content = content;

    fs.writeFileSync(`${dir}/Public/Data/Products/${req.body.id}.json`, JSON.stringify(req.body, null, 2));
    return res.redirect(`/products/${req.body.id}`);

}

export default sell;