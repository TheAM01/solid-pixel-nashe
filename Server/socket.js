import fs from "fs";

function socketHandler(socket, io, dir) {

    socket.on("home_products", (data) => {
        console.log("hi")
        const json = fs.readFileSync(`${dir}/Public/Data/products.json`, {encoding: 'utf8'});
        const products = JSON.parse(json);
        io.to(socket.id).emit("home_products" ,products);
    })
}

export default socketHandler