// We need this in order to use @Decorators
// DO NOT CHANGE THE LINE SPACING OF THE IMPORTS
// OR THE LINTER WILL REORDER THEM
import 'reflect-metadata';

import { startServer } from './src/server';

// Additional initializations can go here
console.log('Additional initializations or logic before starting the server.');

// Now explicitly start the server
startServer().then(() => {
  console.log('Server started successfully.');
}).catch((error) => {
  console.error('Failed to start the server:', error);
});
