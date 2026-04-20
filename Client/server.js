const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.static('public'));
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); });
app.get('/health', (req, res) => {
    if (process.send) {
        process.send('uptime');
        const _t = setTimeout(() => res.json({ status: 'ok', uptime: Math.floor(process.uptime()) }), 2000);
        process.once('message', (parentUptime) => {
            clearTimeout(_t);
            res.json({ status: 'ok', botUptime: Math.floor(process.uptime()), processUptime: Math.floor(parentUptime) });
        });
    } else {
        res.json({ status: 'ok', uptime: Math.floor(process.uptime()) });
    }
});
app.all('/process', (req, res) => {
    const { send } = req.query;
    if (!send) return res.status(400).json({ error: 'Missing send query' });
    if (process.send) { process.send(send); res.json({ status: 'ok', data: send }); }
    else res.json({ error: 'No IPC channel' });
});
app.listen(port, () => console.log('Server running on port ' + port));

module.exports = app;
