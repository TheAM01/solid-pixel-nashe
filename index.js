import http from 'http';
import path from "path";
import express from "express";
import { Server } from "socket.io";
import bodyParser from 'body-parser';
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import createRoutes from "./Server/routes.js";
import socketHandler from './Server/socket.js';
import db from "./Server/db.js";


const app = express();
const dir = path.resolve();
const jsonParser = bodyParser.json();
const server = http.createServer(app);
const port  = process.env.PORT || 2000 || 2001;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const sessionMiddleware = session({
    secret: "WAHOOOO",
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: MongoStore.create({ mongoUrl: `mongodb+srv://saste-nashe-main:${process.env.MONGO_PASSWORD}@saste-nashe-db.xlhdm.mongodb.net/?retryWrites=true&w=majority&appName=saste-nashe-db` })
});

app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser());
app.use(sessionMiddleware);

const io = new Server(server);

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on('connection', (socket) => {
    socketHandler(socket, io, dir);
});

createRoutes(app, dir);

server.listen(port, async () => {
    console.clear();
    console.log(`Listening on port:\x1b[33m ${port}\x1b[0m`);
});