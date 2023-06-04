const mongoose = require('mongoose');

const dbURI = require('../config/db.config').DB_URI;

// connect to database
const dbConnection = mongoose.createConnection(dbURI,
                                               {
                                                 useNewUrlParser: true,
                                                 useUnifiedTopology : true
                                               }
                                              );

module.exports = dbConnection;

// mise en place des abonnements aux événéments
dbConnection.on('connected',
  () => console.log(`dbConnection.js : connected to ${dbURI}`)
);
dbConnection.on('disconnected',
  () => console.log(`dbConnection.js : disconnected from ${dbURI}`)
);
dbConnection.on('error',
  error => console.log(`dbConnection.js : error connection ${error}`)
);

const shutdown = (msg, callback) => {
  dbConnection.close(
    () => {
      console.log(` Mongoose shutdown : ${msg}`);
      callback();
    }
  );
}

const readline = require('readline');
if (process.platform === 'win32') {
  readline
  .createInterface({
    input: process.stdin,
    output: process.stdout
  })
  .on('SIGINT', function() {
    process.emit('SIGINT');
  })
};

process.on('SIGINT', () => shutdown('application ends', () => process.exit(0)) ); // application killed (Ctrl+c)
process.on('SIGTERM', () => shutdown( 'SIGTERM received', () => process.exit(0)) ); // process killed (POSIX)
