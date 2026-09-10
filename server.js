import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
});

// Initial bus data
let buses = [
  { 
    id: 'BUS-101', 
    name: 'Bus 101', 
    route: 'Route A - North Campus', 
    lat: 17.502184, 
    lng: 78.394876, 
    speed: 45, 
    driver: 'John Doe', 
    nextStop: 'Main Gate', 
    status: 'active' 
  },
  { 
    id: 'BUS-202', 
    name: 'Bus 202', 
    route: 'Route B - South Campus', 
    lat: 17.512184, 
    lng: 78.404876, 
    speed: 50, 
    driver: 'Jane Smith', 
    nextStop: 'Library Stop', 
    status: 'active' 
  },
  { 
    id: 'BUS-303', 
    name: 'Bus 303', 
    route: 'Route C - East Campus', 
    lat: 17.492184, 
    lng: 78.384876, 
    speed: 40, 
    driver: 'Mike Johnson', 
    nextStop: 'Cafeteria', 
    status: 'warning' 
  },
];

// Simulate bus movement every 3 seconds
setInterval(() => {
  buses = buses.map(bus => ({
    ...bus,
    // Random movement (±0.001 degrees ≈ ±100 meters)
    lat: bus.lat + (Math.random() - 0.5) * 0.001,
    lng: bus.lng + (Math.random() - 0.5) * 0.001,
    // Random speed variation (±5 km/h)
    speed: Math.max(20, Math.min(60, bus.speed + (Math.random() - 0.5) * 5))
  }));
  
  io.emit("bus_locations", buses);
  console.log(`📍 [${new Date().toLocaleTimeString()}] Sent locations for ${buses.length} buses`);
}, 3000);

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Send initial data immediately
  socket.emit("bus_locations", buses);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Serve static frontend files from the built dist folder
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback — send index.html for any unmatched GET route
app.get('/*path', (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Azure App Service supplies PORT via environment variable (default 8080)
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚍 Bus Tracking Mock Server Started`);
  console.log(`📡 Socket.IO server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Serving static frontend from /dist`);
  console.log(`🗺️  Tracking ${buses.length} buses\n`);
});
