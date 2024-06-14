const { exec } = require('child_process');
const os = require('os');

const url = 'http://127.0.0.1:8080/index.html';
const command = os.platform() === 'win32' ? `start ${url}` :
    os.platform() === 'darwin' ? `open ${url}` :
        `xdg-open ${url}`;

setTimeout(_=>{
    exec(command);
},3000)
