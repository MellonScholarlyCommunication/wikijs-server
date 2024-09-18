const logger = require('ldn-inbox-server').getLogger();
const { generateId , generatePublished } = require('ldn-inbox-server');
const fsPath = require('path');
const fs = require('fs');
const md5 = require('md5');

async function handle({path,options,config,notification}) {
    if (! config) {
        logger.error('no configuration found');
        return { path, options, success: false };
    }
   
    if (! config['actor']) {
        logger.error('no actor entry'); 
        return { path, options, success: false };
    }

    try {
        const announce = {
                '@context': "https://www.w3.org/ns/activitystreams" ,
                id: generateId(),
                type: 'Announce',
                published: generatePublished(),
                actor: config['actor'],
                origin: config['origin'],
                inReplyTo: notification['id'],
                object: {
                    id: notification['object']['context'],
                    type: "Document"
                },
                target: notification['actor']
        };

        const json = JSON.stringify(announce,null,4);

        const outboxFile = options['outbox'] + '/' + md5(json) + '.jsonld';

        ensureDirectoryExistence(outboxFile);

        logger.info(`storing ${announce.type} to ${outboxFile}`);

        fs.writeFileSync(outboxFile,json);

        return { path, options, success: true };
    }
    catch(e) {
        logger.error(`failed to process ${path}`);
        logger.error(e);
        return { path, options, success: false };
    }
}

function ensureDirectoryExistence(filePath) {
    var dirname = fsPath.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

module.exports = { handle };