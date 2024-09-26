const logger = require('ldn-inbox-server').getLogger();
const { fetchOriginal } = require('ldn-inbox-server');
const fsPath = require('path');
const { resolvePage , getPage, updatePage } = require('wikijs-cli');
const { stringSimilarity } = require("string-similarity-js");

/**
 * Handler to update wiki.js with new data
 */
async function handle({path,options,config,notification}) {
    const similarityTreshold = 
            config.threshold ? config.threshold : 0.999;

    try {
        const researcherProfile = notification['object']['isVersionOf']['id'];

        if (! researcherProfile) {
            logger.error(`failed to find object.isVersionOf.id property in notification`);
            return { path, options, success: false };
        }

        const updateUrl = notification['object']['id'];

        if (! updateUrl) {
            logger.error(`failed to find object.id property in notification`);
            return { path, options, success: false };
        }

        const updatedContent = await fetchOriginal(updateUrl);
       
        if (! updatedContent) {
            logger.error(`failed to retrieve ${updateUrl}`);
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

        const simScore = stringSimilarity(currentContent,updatedContent);

        logger.info(`updated content has a similarity score of ${simScore}`);
        logger.debug(updatedContent);

        if (simScore < similarityTreshold) {
            logger.info(`content needs to be updated`);
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