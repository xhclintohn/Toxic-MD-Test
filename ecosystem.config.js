module.exports = {
    apps: [{
        name: 'toxic-md',
        script: 'index.js',
        autorestart: true,
        watch: false,
        instances: 1,
        exp_backoff_restart_delay: 100,
    }]
};
