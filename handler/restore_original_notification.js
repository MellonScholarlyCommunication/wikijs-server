const logger = require('ldn-inbox-server').getLogger();
const { getCache } = require('eventlog-server');

/**
 * Handler restore the original notification
 */
async function handle({path,options,config,notification}) {
    try {
        const inReplyTo = notification['inReplyTo'];

        const originalNotification = await getCache(inReplyTo,{ name: process.env.CACHE_NAME });

        if (!originalNotification) {
            logger.error(`can not find the original notification for ${inReplyTo}`);
            return { path, options, success: false };
        }

        options['originalNotification'] = originalNotification;
        
        return { path, options, success: true };
    }
    catch(e) {
        logger.error(`failed to process ${path}`);
        logger.error(e);
        return { path, options, success: false };
    }
}

module.exports = { handle };