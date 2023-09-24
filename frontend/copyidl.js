// copyIdl.js
const fs = require('fs');
const idl = require('../solana-voting-programs/target/idl/solana_voting.json');

fs.writeFileSync('./src/votingidl.json', JSON.stringify(idl));