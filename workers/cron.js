var CronJob = require('cron').CronJob

module.exports = {
    cronEvery15Minutes : (done) => {
        job = new CronJob({
            cronTime: '*/1 * * * *',
            onTick: () => {
                sails.log.info('run every 15 mins');
                MatchesService.updateScores('1', (err, result) => {
                    sails.log.info(result)
                });
            },
            start: false,
            timeZone: "Asia/Saigon"
        });
        job.start();
        return done(null)
    },
    cronEveryDay : (done) => {
        job = new CronJob({
            cronTime: '01 00 00 * * *',
            onTick: () => {
                sails.log.info('run every 24 hours');
                //MatchesService.get();
            },
            start: false,
            timeZone: "Asia/Saigon"
        });
        job.start();
        return done(null)
    }
}