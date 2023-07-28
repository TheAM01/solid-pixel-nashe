function createRoutes(app, dir) {

    app.get('/', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/products', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    })

    app.get('/products/:product', (req, res) => {
        res.sendFile(dir + "/Public/Dynamic/product.html")
    });

    app.get('/style.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style.css")
    })

    app.get('/style-minor.css', (req, res) => {
        res.sendFile(dir + "/Public/Styles/style_minor.css")
    });

    app.get('/script.js', (req, res) => {
        res.sendFile(dir + "/Public/Scripts/script.js")
    })

}

export default createRoutes