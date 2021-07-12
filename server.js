const { createQuicSocket } = require('net')

// this one exists in nodejs 15.0.0 compiled with --experimental-quic
console.log(createQuicSocket);

const { readFileSync } = require('fs')
const key = readFileSync('./uWebSockets.js/misc/key.pem')
const cert = readFileSync('./uWebSockets.js/misc/cert.pem')

const server = createQuicSocket({
    // Bind to local UDP port 5678
    endpoint: { port: 5678 },
})

server.listen({ alpn: 'echo', key: key, cert: cert })

server.on('ready', () => {
    console.log(server.endpoints[0].address.port);
    console.log(`QUIC server is listening on ${server.endpoints[0].address.port}`)
})

server.on('sessionError', (error, session) => {
    console.log('error:', error.message);
});

server.on('session', (session) => {
    session.on('stream', (stream) => {
        stream.on('data', (chunk) => {
            msg++;
            stream.write(chunk);
        })
    })
})

// perf
let msg = 0;
setInterval(() => {
    console.log("Total messages per second: " + msg);
    msg = 0;
}, 1000);