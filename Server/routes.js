function createRoutes(app, dir) {

    app.get('/', (req, res) => {
        res.sendFile(dir + "/Public/index.html")
    });

    app.get('/style.css', (req, res) => {
        res.sendFile(dir + "/Public/style.css")
    })

    app.get('/style-minor.css', (req, res) => {
        res.sendFile(dir + "/Public/style_minor.css")
    });

    app.get('/script.js', (req, res) => {
        res.sendFile(dir + "/Public/script.js")
    })

}

export default createRoutes