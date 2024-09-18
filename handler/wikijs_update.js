const logger = require('ldn-inbox-server').getLogger();
const fsPath = require('path');
const { resolvePage , getPage, contentInserter, updatePage } = require('wikijs-cli');

/**
 * Handler to update wiki.js with new data
 */
async function handle({path,options,config,notification}) {
    try {
        const researcherProfile = notification['object']['context'];

        if (! researcherProfile) {
            logger.error(`failed to find object.context property in notification`);
            return { path, options, success: false };
        }

        const htmlCitation = notification['object']['object']['content'];

        if (! htmlCitation) {
            logger.error(`failed to find object.object.content property in notification`);
            return { path, options, success: false };
        }

        // Try to update the old Wiki.js researcher profile with the updated citation
        const wiki_url = process.env.WIKIJS_URL;
        const wiki_acess_token = process.env.WIKIJS_ACCESS_TOKEN;

        const resolvedPage = await resolvePage(researcherProfile, {
            url: wiki_url ,
            token: wiki_acess_token
        });

        if (! resolvedPage ) {
            logger.error(`failed to resolve ${researcherProfile} at wiki.js`);
            return { path, options, success: false };
        }
        else {
            logger.info(`resolved ${researcherProfile} to be wiki.js page ${resolvedPage.id}`);
        }
    
        const currentPage = await getPage(resolvedPage.id, {
            url: wiki_url ,
            token: wiki_acess_token 
        });

        if (! currentPage) {
            logger.error(`failed to fetch page ${resolvedPage.id} at wiki.js`);
            return { path, options, success: false };
        }
        else {
            logger.info(`fetched page ${resolvedPage.id}`);
        }

        const currentContent = currentPage.content;
        
        logger.debug(`currentContent`);
        logger.debug(currentContent);
        logger.debug(`htmlCitation`);
        logger.debug(htmlCitation);

        const updatedContent = await contentInserter(currentContent, htmlCitation, {
            tag: "mastodon-bot",
            overwrite: false,
            similarity: 0.9,
            similarityNormalization: 'html'
        });

        if (updatedContent) {
            logger.info(`content needs to be updated`);
            logger.debug(updatedContent);
            options['has_update'] = true;
        }
        else {
            logger.info(`content seems similar, no update needed`);
            options['has_update'] = false;
            return { path, options, success: true }; 
        }

        if (process.env.DEMO_MODE) {
            logger.info(`**demo mode** I will not do anything`);
        }
        else {
            const newPage = await updatePage(currentPage.id , {
                content: updatedContent
            }, {
                url: wiki_url ,
                token: wiki_acess_token
            });

            if (! newPage) {
                logger.error(`failed to update ${currentPage.id} at wiki.js`);
                return { path, options, success: false };
            }
            else {
                logger.info(`updated page ${currentPage.id} at wiki.js`);
            }
        }

        return { path, options, success: true };
    }
    catch(e) {
        logger.error(`failed to process ${path}`);
        logger.error(e);
        return { path, options, success: false };
    }
}

module.exports = { handle };