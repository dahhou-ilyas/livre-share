const { default: mongoose } = require('mongoose');
const app=require('./app/index');
const http = require('http');
const { Server } = require('socket.io');


const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});


const port = process.env.PORT || '3000'

mongoose.connect("mongodb://127.0.0.1:27017/userlivre")
.then(() => {
    server.listen(port,()=>{
        console.log("app listen in http://localhost:3000");
    })
})
.catch((error) => {
  console.error("Erreur de connexion à MongoDB :", error.message);
});

