const http = require('http');
const app = require('./app');
const { setupWebSocket } = require('./services/webSocketService');

const server = http.createServer(app);
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});