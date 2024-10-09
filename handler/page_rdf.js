const { resolvePage , getPage , toRDF } = require('wikijs-cli');
const logger = require('ldn-inbox-server').getLogger();

/**
 * Return the Markdown of a wiki page if exists
 */
async function handle(req,res,config) {
    const resolvent = req.url.replace(/^\/[^\/]+\//,'');
    const options = {
        url: process.env.WIKIJS_URL ,
        token: process.env.WIKIJS_ACCESS_TOKEN
    };

    const resolvedPage = await resolvePage(resolvent,options);

    if (!resolvedPage) {
        res.writeHead(404);
        res.end(`No such page`);
        return;
    }

    const page = await getPage(resolvedPage.id,options);

    const markdown = page.content;
    const rdf = await toRDF(markdown, resolvent, process.env.CONTENT_TAG)

    if (! page) {
        logger.error(`failed to resolve page ${resolvedPage.id}`);
        res.writeHead(404);
        res.end(`No such page`);
        return;
    }

    if (page.isPrivate) {
        res.writeHead(403);
        res.end('Forbidden');  
    }

    if (req.method === 'GET') {
        res.setHeader('Content-Type','text/turtle');
        res.writeHead(200);
        res.end(rdf); 
    }
    else if (req.method === 'HEAD') {
        res.setHeader('Content-Type','text/turtle');
        res.writeHead(200);
        res.end();  
    }
    else {
        res.writeHead(403);
        res.end('Forbidden'); 
    }
}

module.exports = { handle };