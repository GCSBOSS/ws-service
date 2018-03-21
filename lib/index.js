const path = require('path');
const yaml = require('node-yaml');
const ws = require('ws');
const { spawn } = require('child_process');

class WSServer{

    constructor(conf){

        // Grabs conf path and settngs object.
        this.configDir = path.dirname(conf);
        this.settings = yaml.readSync(conf);

        // Raise if settings not enough.
        if(!this.settings.port || !this.settings.command)
            throw 'invalid-settings';
    }

    listen(){
        const noop = function(){};
        const heartbeat = function(){ this.isAlive = true; };

        // Start WS server.
        this.socket = new ws.Server({ port: this.settings.port });

        // Define connection handler.
        this.socket.on('connection', client => {

            // Define alive check routine.
            client.isAlive = true;
            client.on('pong', heartbeat);

            // Start client process.
            var proc = spawn(this.settings.command, this.settings.args || [], {
                cwd: this.configDir,
                env: this.settings.env || {},
                windowsHide: true
            });
            proc.on('error', err => {
                throw 'bad-command';
            });

            // Defines process write error handler.
            proc.stdin.on('error', err => {
                throw 'no-io-in-process';
            });

            // React on client message.
            client.on('message', message => {

                // Pipe message to client process.
                proc.stdin.write(message + "\n");
            });

            // Reacts on process output.
            proc.stdout.on('data', chunk => {
                client.send(chunk.toString());
            });

            // Defines client error handler.
            client.on('error', err => {
                console.log(err);
            });
        });

        // Set server ping-pong timeout.
        setInterval(() => {
            this.socket.clients.forEach(c => {
                if(c.isAlive === false)
                    return c.terminate();
                c.isAlive = false;
                c.ping(noop);
            });
        }, 30000);
    }
}

module.exports = WSServer;
