const { createQuicSocket } = require('net')

// this one exists in nodejs 15.0.0 compiled with --experimental-quic
console.log(createQuicSocket);

// perf
let msg = 0;
setInterval(() => {
    console.log("Total messages per second: " + msg);
    msg = 0;
}, 1000);

for (let i = 0; i < 40; i++) {
    createQuicSocket().connect({
        address: 'localhost',
        port: 5678,
        alpn: 'echo',
    }).then((s) => {
        s.on('sessionError', () => {
            console.log("session error client");
        });

        s.on('secure', (host) => {
            s.openStream().then((s) => {
                s.write("hello biatch: " + i);
                s.on('data', (chunk) => {
                    msg++;
                    s.write(chunk);
                });
            });
        })
    });
}
