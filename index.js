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
    console.log(`Listening on port: ${port}`);
});