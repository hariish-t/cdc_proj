require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const systemCollector = require('./utils/systemCollector');

// Import routes
const systemRoutes = require('./routes/system.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store system info (collected once on startup)
let staticSystemInfo = null;

// === MONGODB CONNECTION ===

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  MongoDB URI not found - history features disabled');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Running without database - history features disabled');
  }
};

// === SOCKET.IO REAL-TIME PIPELINE ===

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Send static system info immediately on connection
  if (staticSystemInfo) {
    socket.emit('system:info', staticSystemInfo);
  }

  // Start streaming metrics every 1 second
  const metricsInterval = setInterval(async () => {
    try {
      const metrics = await systemCollector.collectAll();
      if (metrics) {
        socket.emit('system:metrics', metrics);
      }
    } catch (error) {
      console.error('Metrics emission error:', error);
    }
  }, 1000);

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    clearInterval(metricsInterval);
  });
});

// === REST API ROUTES ===

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: Date.now(),
    service: 'SystemStream Backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount routes
app.use('/api/system', systemRoutes);
app.use('/api/history', historyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// === STARTUP ===

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Collect static system info on startup
    console.log('🔍 Collecting system information...');
    staticSystemInfo = await systemCollector.getSystemInfo();
    
    console.log('📊 System Info:');
    console.log('  CPU:', staticSystemInfo.cpu.model);
    console.log('  Cores:', staticSystemInfo.cpu.cores);
    console.log('  OS:', staticSystemInfo.os.distro);
    console.log('  Kernel:', staticSystemInfo.os.kernel);
    
    // Start server
    server.listen(PORT, () => {
      console.log('\n🚀 SystemStream Backend Running');
      console.log(`   HTTP API: http://localhost:${PORT}`);
      console.log(`   WebSocket: ws://localhost:${PORT}`);
      console.log('\n📡 Broadcasting metrics every 1 second...\n');
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    console.log('✅ Server closed');
    process.exit(0);
  });
});
