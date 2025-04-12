const { v4: uuidv4 } = require('uuid');

function generateTrackingCode() {
  return `TRK-${uuidv4()}`;
}

module.exports = { generateTrackingCode };
