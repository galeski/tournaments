const { spawn } = require('child_process');

// Start the server
const server = spawn('npm', ['start', '--prefix', 'server/']);

// Start the client
const client = spawn('npm', ['run', 'dev', '--prefix', 'client/']);

// Log output
server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

client.stdout.on('data', (data) => {
  console.log(`Client: ${data}`);
});

// Log errors
server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

client.stderr.on('data', (data) => {
  console.error(`Client Error: ${data}`);
});
