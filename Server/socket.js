import fs from "fs";

function socketHandler(socket, io, dir) {

    socket.on("home_products", (data) => {
        const json = fs.readFileSync(`${dir}/Public/Data/products.json`, {encoding: 'utf8'});
        const products = JSON.parse(json);
        io.to(socket.id).emit("home_products" ,products);
    });

    socket.on("product", (pr) => {
        const json = fs.readFileSync(`${dir}/Public/Data/products.json`, {encoding: 'utf8'});
        const products = JSON.parse(json);
        const product = products.find(p => p.id.toLowerCase() === pr.toLowerCase());

        if (!product) return io.to(socket.id).emit("product", 404);

        io.to(socket.id).emit("product", product);
    })  
}

export default socketHandler