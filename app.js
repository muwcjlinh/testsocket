const WebSocket = require('ws');
const express = require('express');

const port = process.env.PORT ? process.env.PORT : 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log('HTTP server running on port:', port);
});

// const wss = new WebSocket.Server({ port: 8080 }, () => {
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log("Signaling server is now listening on port 8080")
});

// Broadcast to all.
wss.broadcast = (ws, data) => {
    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws) => {
    console.log(`Client connected. Total connected clients: ${wss.clients.size}`)
    
    ws.onmessage = (message) => {
        console.log(message.data + "\n");
        wss.broadcast(ws, message.data);
    }

    ws.onclose = () => {
        console.log(`Client disconnected. Total connected clients: ${wss.clients.size}`)
    }
});