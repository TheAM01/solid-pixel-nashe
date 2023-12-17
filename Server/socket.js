import fs from "fs";

let print = (...args) => {
    console.log(args);
}

if (process.env.ENV !== "PRODUCTION") print = () => {};

function socketHandler(socket, io, dir) {

    // socket functions below

    socket.on("log", print)

    socket.on("home_products", (data) => {

        const products = makeProducts(dir);
        io.to(socket.id).emit("home_products" ,products);

    });

    socket.on("product", (pr) => {

        const products = makeProducts(dir);
        const product = products.find(p => p.id.toLowerCase() === pr.toLowerCase());
        if (!product) return io.to(socket.id).emit("product", 404);
        io.to(socket.id).emit("product", product);

    });

    // i cant tssee i cant see i cant see
    // the fog is comong the fog is coming the fog is coming

    socket.on("get_categories", (data) => {

        const products = makeProducts(dir);
        let categories = [];
        products.forEach(p => {
            if (categories.includes(p.category.toLowerCase())) return;
            categories.push(p.category.toLowerCase())
        });
        io.to(socket.id).emit("get_categories", categories);

    });

    socket.on("get_category", (data) => {

        const products = makeProducts(dir);
        let matches = [];
        products.forEach(p => {
            if (p.category.toLowerCase() === data) matches.push(p);
        });
        io.to(socket.id).emit("get_category", matches);

    });

    socket.on("products_list", (data) => {

        const products = makeProducts(dir);
        const arr = [];
        products.forEach(p => {
            arr.push(p.id);
        });
        io.to(socket.id).emit("products_list", arr);

    });

    socket.on("get_ad", (data) => {

        const raw = fs.readFileSync(dir+"/Public/Data/ads.json");
        const ads = JSON.parse(raw);

        const random = ads[Math.floor(Math.random()*ads.length)];
        io.to(socket.id).emit("get_ad", random)

    });

}

function sorter(a, b) {
    return b.reviews.length - a.reviews.length
}

function makeProducts(dir) {

    const directory = fs.readdirSync(`${dir}/Public/Data/Products`);
    const productsRaw = [];

    directory.forEach(pr => {
        return productsRaw.push(JSON.parse(fs.readFileSync(`${dir}/Public/Data/Products/${pr}`)));
    });

    const products = productsRaw.sort(sorter);
    
    return products;

}

export default socketHandler