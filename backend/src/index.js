import express from 'express';
import cors from 'cors';
import {Server as CreateServer} from 'http';
import {WebSocketServer} from 'ws';
import config from './config/server.config.js';
import yws from 'y-websocket/bin/utils';


const app = express();

app.use(cors({
    origin: config.ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true // Allow cookies to be sent with requests
}));

app.use(express.json());

//create server
const httpServer = CreateServer(app);
//websocket server
const wss = new WebSocketServer({server: httpServer}); 

wss.on('connection', (ws, req) => {
    try {
        // Parse the URL to get query parameters
        // req.url typically looks like "/roomname?auth=Username"
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const authName = requestUrl.searchParams.get('auth');

        if (!authName) {
            console.log('Connection rejected: Missing auth parameter');
            ws.close(1008, 'Unauthorized: Username is required');
            return;
        }

        console.log(`New client connected: ${authName} to ${requestUrl.pathname}`);
        
        yws.setupWSConnection(ws, req); // Handle WebSocket connection using y-websocket utility
        
    } catch (error) {
        console.error('Connection handling error:', error);
        ws.close(1011, 'Internal Error');
    }
});

httpServer.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

