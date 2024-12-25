import sell from "./Functions/sell.js";
import bcrypt from "bcryptjs";
import signup from "./Functions/signup.js";
import login from "./Functions/login.js";
import db from "./db.js";
import cart from "./Functions/cart.js";

function createRoutes(app, dir) {

    // HOME

    app.get('/', (req, res) => {
        console.log(req.session.user, req.session.authenticated);
        res.sendFile(dir + "/Public/index.html");
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/products', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });


    // STATICS

    app.get('/disclaimer', (req, res) => {
        res.sendFile(dir + "/Public/Static/disclaimer.html")
    });

    app.get('/customer-care', (req, res) => {
        res.redirect("//discord.gg/VJ8jHWTj4K")
    });

    app.get('/affiliate', (req, res) => {
        res.sendFile(dir + "/Public/Static/affiliate.html");
    });


    // DYNAMICS

    app.get('/search', (req, res) => {
        res.sendFile(dir + '/Public/Dynamic/search.html');
    })

    app.get('/products/:product', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/product.html")
    });

    app.get('/category', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/categories.html");
    });

    app.get('/category/:category', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/category.html");
    });

    app.get('/cart', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/cart.html")
    });

    app.get('/sell', (req, res) => {
        if (!req.session.authenticated)
            return res.redirect('/login?login-first=true&redirect-to=sell');

        if (!req.session.user)
            return res.redirect('/login?login-first=true&redirect-to=sell');

        res.sendFile(dir + "/Public/Dynamic/sell.html")
    });

    app.get('/recently-sold', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/recently-sold.html")
    });


    // USER

    app.get('/login', (req, res) => {

        if (!!req.session.authenticated && !!req.session.user)
            return res.redirect(`/${req.query['redirect-to'] ? req.query['redirect-to'] : ""}?already-logged-in=true`);

        res.sendFile(dir + "/Public/User/login.html");
    });

    app.get('/signup', (req, res) => {
        res.sendFile(dir + "/Public/User/signup.html");
    })

    app.get('/account', (req, res) => {
        if (!req.session.authenticated || !req.session.user)
            return res.redirect('/login?login-first=true&redirect-to=account');

        res.sendFile(dir + '/Public/User/account.html');
    });


    // statics CSS & JS

    app.get('/style.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style.css")
    });

    app.get('/style-minor.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_minor.css")
    });

    app.get('/style-responsive.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_responsive.css")
    });

    app.get('/style-forms.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_forms.css")
    });

    app.get('/script.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/script.js")
    });

    app.get('/common.js', (req, res) => {
       res.sendFile(dir + "/Public/Scripts/common.js");
    });

    app.get('/sell-form.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/sell-form.js");
    });

    app.get('/categories.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/categories.js");
    });

    app.get('/forms.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/forms.js")
    });


    // POST ROUTES

    app.post('/sell', (req, res) => {
        sell(req, res)
    });

    app.post('/login', async (req, res) => {
        await login(req, res);
    });

    app.post('/signup', async (req, res) => {
        await signup(req, res);
    });

    app.post('/cart', async (req, res) => {
        await cart(req, res);
    });

    app.post('/review/:productName', async (req, res) => {

        const product = req.params.productName;

        if (!req.session.authenticated || !req.session.user) {
            return res.redirect(`/login?login-first=true&redirect-to=products%2F${product}`);
        }

        const author = req.session.user;
        const {stars, content} = req.body;

        if (!stars || !author || !content)
            return res.redirect(`/products/${product}?invalid-data=true`);

        const update = {
            $push: {
                reviews: {
                    author: `${author.firstName} ${author.lastName}`,
                    authorUsername: author.username,
                    content: content,
                    stars: stars,
                }
            }
        }

        await db.collection('products').updateOne({id: product}, update)

        return res.redirect(`/products/${product}?success=true`);
    })


    // 404

    app.get("*", (req, res) => {
        res.sendFile(dir + "/Public/Static/not-found.html")
    });

}

export default createRoutes