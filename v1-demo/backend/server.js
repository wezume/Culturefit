const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const candidateRoutes = require('./user/candidate.routes');
const recruiterRoutes = require('./recruiter/recruiter.routes');
const { processPendingCandidates } = require('./scheduler/worker');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/recruiter', recruiterRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'Backend is running' }));

// Initialize Database and Start Server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
    // Start background worker
    console.log('Starting background worker scheduler...');
  });
};

startServer();
