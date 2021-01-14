var async = require("async");

const scraperFileReader = ( url ) => {
    console.log("in scraperFileReader \n" + url);
    var fs = require('fs');
    var content = fs.readFileSync('sample.html', {encoding:'utf8', flag:'r'});
    return content;
}

const scraperLinksReader = ( html ) => {
    console.log("in scraperLinksReader \n" + html);
    const links =  [
            'http://www.aaaa.com',
            'http://www.bbbb.com',
            'http://www.cccc.com',
            'http://www.dddd.com'
        ];
    return links;
}

const scraperFileReaderAsync = async (url) => {
    return new Promise((resolve, reject) => {
        try {
            const html = scraperFileReader(url);
            resolve(html);
        } catch (e) {
            reject(e.message);
        }
    });
}

const scraperLinksReaderAsync = async (html) => {
    return new Promise((resolve, reject) => {

        try {
            const links = scraperLinksReader(html);
            resolve(links);
        } catch (e) {
            reject(e.message);
        }
    });
}

module.exports = { scraperFileReaderAsync, scraperLinksReaderAsync, scraperFileReader, scraperLinksReader };
