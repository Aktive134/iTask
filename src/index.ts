import app from "./app";
import Configuration from "./config";
import Constant from "./constant";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const server = http.createServer(app);

const io = new Server(server,  {cors: {
    origin: "*", // Adjust this to your front-end's origin for security
    methods: ["GET", "POST"]
}});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.set('io', io);

server.listen(Configuration.serverPort, () => console.log(Constant.messages.serverUp));

mongoose.connect(Configuration.Database.url).then(() => {
  console.log('connected to mongoDb');
}).catch((err) => {
  console.error('could not connect to mongoDb\n', err);
});

