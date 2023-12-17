import sell from "./Functions/sell.js";

function createRoutes(app, dir) {

    app.get('/', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/products', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/disclaimer', (req, res) => {
        res.sendFile(dir + "/Public/Static/disclaimer.html")
    });

    app.get('/customer-care', (req, res) => {
        res.redirect("//discord.gg/VJ8jHWTj4K")
    });    

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
        res.sendFile(dir + "/Public/Dynamic/sell.html")
    });

    // statics

    app.get('/style.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style.css")
    });

    app.get('/style-minor.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_minor.css")
    });

    app.get('/style-responsive.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_responsive.css")
    });

    app.get('/script.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/script.js")
    });

    // post routes

    app.post('/sell', (req, res) => {
        sell(req, res, dir)
    });

    // 404

    app.get("*", (req, res) => {
        res.sendFile(dir + "/Public/Static/not-found.html")
    });

}

export default createRoutes