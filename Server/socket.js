import fs from "fs";


function socketHandler(socket, io, dir) {

    // socket functions below

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

    socket.on("get_categories", (data) => {
        const products = makeProducts(dir);
        let categories = [];
        products.forEach(p => {
            if (categories.includes(p.category.toLowerCase())) return;
            categories.push(p.category.toLowerCase())
        });
        io.to(socket.id).emit("get_categories", categories)
    });

    socket.on("get_category", (data) => {
        const products = makeProducts(dir);
        let matches = [];
        products.forEach(p => {
            console.log([p.category.toLowerCase(), data]);
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
    })
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