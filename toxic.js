const chalk = require('chalk');
const path = require('path');
const { spawn } = require('child_process');

const _startTime = Date.now();
let _rc = 0;
let _child = null;
let _shuttingDown = false;

const _print = (label, val) => console.log(`${chalk.green.bold('│')} ${chalk.cyan.bold(label.padEnd(12))}${chalk.yellow.bold(':')} ${val}`);

function _banner() {
    console.log(chalk.green.bold('\n╭─────────────────────────────────╮'));
    console.log(chalk.green.bold('│') + chalk.bold.cyan('         𝐓𝐨𝐱𝐢𝐜-𝐌D  𝐋𝐚𝐮𝐧𝐜𝐡𝐞𝐫         ') + chalk.green.bold('│'));
    console.log(chalk.green.bold('├─────────────────────────────────┤'));
    _print('Status', chalk.greenBright('Igniting engines... 🔥'));
    _print('Process', chalk.white('node ' + path.basename(__filename)));
    _print('Target', chalk.white('index.js'));
    _print('Mode', chalk.cyan('IPC Spawner'));
    console.log(chalk.green.bold('╰─────────────────────────────────╯\n'));
}

function start() {
    if (_shuttingDown) return;
    const args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];
    _child = spawn(process.execPath, args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });

    _child.on('message', (msg) => {
        if (msg === 'reset') {
            console.log(chalk.yellow('\n╭─────( TOXIC-MD )─────╮'));
            console.log(chalk.yellow('│') + chalk.white(' 🔄 Restart requested   ') + chalk.yellow('│'));
            console.log(chalk.yellow('╰──────────────────────╯'));
            if (_child) { try { _child.kill(); } catch (_) {} }
            setTimeout(start, 1500);
        } else if (msg === 'shutdown') {
            _shuttingDown = true;
            console.log(chalk.redBright('\n╭─────( TOXIC-MD )─────╮'));
            console.log(chalk.redBright('│') + chalk.white(' 💀 Shutting down...    ') + chalk.redBright('│'));
            console.log(chalk.redBright('╰──────────────────────╯'));
            if (_child) { try { _child.kill(); } catch (_) {} }
            process.exit(0);
        } else if (msg === 'uptime') {
            try { _child.send(process.uptime()); } catch (_) {}
        }
    });

    _child.on('exit', (code, signal) => {
        if (_shuttingDown) return;
        _rc++;
        const delay = Math.min(_rc * 2000, 15000);
        if (code !== null && code !== 0) {
            console.log(chalk.redBright(`\n> ───≫ 💥 Process crashed (code: ${code}) — restarting in ${delay / 1000}s ≪───`));
        } else {
            console.log(chalk.yellow(`\n> ───≫ 🔄 Process exited (${signal || code}) — restarting in ${delay / 1000}s ≪───`));
        }
        setTimeout(start, delay);
    });

    _child.on('error', (err) => {
        console.log(chalk.redBright('> ───≫ ❌ Spawn error: ' + err.message + ' ≪───'));
    });
}

process.on('SIGINT', () => {
    _shuttingDown = true;
    console.log(chalk.yellow('\n> ───≫ 🛑 SIGINT — stopping Toxic-MD ≪───'));
    if (_child) { try { _child.kill('SIGINT'); } catch (_) {} }
    process.exit(0);
});

process.on('SIGTERM', () => {
    _shuttingDown = true;
    console.log(chalk.yellow('\n> ───≫ 🛑 SIGTERM — stopping Toxic-MD ≪───'));
    if (_child) { try { _child.kill('SIGTERM'); } catch (_) {} }
    process.exit(0);
});

_banner();
start();
