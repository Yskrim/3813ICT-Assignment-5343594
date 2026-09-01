const fs = require('fs/promises');
const path = require('path');

async function readJson(file) {
    const filePath = path.join(__dirname, 'data', file);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }
  async function writeJson(file, data) {
    const filePath = path.join(__dirname, 'data', file);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
module.exports = { readJson, writeJson }