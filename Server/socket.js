import fs from "fs";


function socketHandler(socket, io, dir) {

    // directory and products declaration

    const directory = fs.readdirSync(`${dir}/Public/Data/Products`);
    const productsRaw = [];
    directory.forEach(pr => {
        return productsRaw.push(JSON.parse(fs.readFileSync(`${dir}/Public/Data/Products/${pr}`)));
    });
    const products = productsRaw.sort(sorter);

    // socket functions below

    socket.on("home_products", (data) => {
        io.to(socket.id).emit("home_products" ,products);
    });

    socket.on("product", (pr) => {
        const product = products.find(p => p.id.toLowerCase() === pr.toLowerCase());
        if (!product) return io.to(socket.id).emit("product", 404);
        io.to(socket.id).emit("product", product);
    });

    socket.on("get_categories", (data) => {
        let categories = [];
        products.forEach(p => {
            if (categories.includes(p.category.toLowerCase())) return;
            categories.push(p.category.toLowerCase())
        });
        io.to(socket.id).emit("get_categories", categories)
    });

    socket.on("get_category", (data) => {
        let matches = [];
        products.forEach(p => {
            console.log([p.category.toLowerCase(), data]);
            if (p.category.toLowerCase() === data) matches.push(p);
        });
        io.to(socket.id).emit("get_category", matches);
    });
}

function sorter(a, b) {
    return b.reviews.length - a.reviews.length
}

export default socketHandler