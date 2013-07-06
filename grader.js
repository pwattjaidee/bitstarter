#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio.
Teaches command line application development and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var url = require('url');
var restler = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var getChecks = function(html, checksfile, callback) {
    fs.readFile(checksfile, function(error, data) {
        
	if(error) throw error;
	
        var checks = JSON.parse(data);
        var $ = cheerio.load(html);
        var out = {};
	
        for(var ii in checks) {
            var present = $(checks[ii]).length > 0;
            out[checks[ii]] = present;
        }
	
        callback(out);
    });
};

var checkHtmlFile = function(htmlfile, checksfile, callback) {
    fs.readFile(htmlfile, function(err, data) {
        if(err) throw err;
        getChecks(data, checksfile, callback);
    });
};

var checkUrlFile = function(url, checksfile, callback) {
    restler.get(url).on('success', function(data, response) {
        getChecks(response, checksfile, callback);
	}
			).on('error', function(err, response) {
			    throw 'Connection error!';
			    }
			     );
};

var out2console = function(data) {
    var outJson = JSON.stringify(data, null, 4);
    console.log(outJson);
};

var clone = function(fn) {
    // Workaround for commander.js issue
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to .json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f,  --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u,  --url <url>', 'URL to html page')
        .parse(process.argv);
        if(program.url){
            checkUrlFile(program.url, program.checks, out2console);
        } else {
            checkHtmlFile(program.file, program.checks, out2console);
        }
} else {
    exports.checkHtmlFile = checkHtmlFile;
    exports.checkUrl = checkUrl;
}
