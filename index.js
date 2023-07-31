import fs from 'fs';
import http from 'http';
import path from "path";
import express from "express";
import { Server } from "socket.io";
import bodyParser from 'body-parser';

import createRoutes from "./Server/routes.js";
import socketHandler from './Server/socket.js';

const app = express();
const dir = path.resolve();
const jsonParser = bodyParser.json();
const server = http.createServer(app);
const port  = process.env.PORT || 2000 || 2001;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(jsonParser);
app.use(urlencodedParser);

const io = new Server(server);

io.on('connection', (socket) => {
    socketHandler(socket, io, dir);
});

createRoutes(app, dir);

server.listen(port, () => {
    console.clear();
    console.log(`Listening on port:\x1b[33m ${port}\x1b[0m`);

    return;
    
    const location = dir + "/Public/Data";
    const directory = fs.readdirSync(location);

    const productsRaw = fs.readFileSync(location + "/products.json");
    const products = JSON.parse(productsRaw);

    products.forEach(p => {
        fs.writeFileSync(location + `/Products/${p.id}.json`, JSON.stringify(p, null, 2))
    });

});