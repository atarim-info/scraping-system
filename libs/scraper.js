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
            {url: 'http://www.aaaa.com'},
            {url: 'http://www.bbbb.com'},
            {url: 'http://www.cccc.com'},
            {url: 'http://www.dddd.com'}
        ];
    return links;
}

exports.scraperFileReader = scraperFileReader;
exports.scraperLinksReader = scraperLinksReader;