const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT ? process.env.PORT : 8080;

const server = http.createServer((req, res) => {
    res.write('hello client');
    res.end();
});

const wss = new WebSocket.Server({ server }, () => {
    console.log("Signaling server is now listening on port:", port)
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

server.listen(port, () => {
    console.log('server is running on port:', port);
});