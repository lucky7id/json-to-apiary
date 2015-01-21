var _ = require('lodash');
var fs = require('fs');
var grunt = require('grunt');
var TABSPACE = '        ';
var NL = '\n';

function prettyJSON(val) {
    var pretty = JSON.stringify(val, null, 4);
    var spaced = _.map(pretty.split(NL), function(line) {
        var newLine;
        newLine = TABSPACE + line;
        return newLine;
    });
    return spaced.join(NL);
}

function apiToMD(route) {
    var md = _.map(route.api, function(api){
        var str = '### ';
        var code = api.responseCode || 200;
        str += api.description + ' [' + api.method + ']' + NL;
        str += '+ Request (application/json)' + NL + NL;
        str += prettyJSON(api.request || {}) + NL +  NL;
        str += '+ Response ' + code + ' (application/json)' + NL + NL;
        str += prettyJSON(api.response || {}) + NL;
        return str;
    }).join(NL);
    return md || '';
}

function routesToMD(routes) {
    var md = _.map(routes, function(route) {
        var str = '';
        str += '## ' + route.name + ' [' + route.route + '/]\n';
        str += apiToMD(route);
        str += NL;
        return str;
    }).join(NL);
    return md;
}

function groupToMd(routes) {

    var md = _.map(routes, function(group) {
        var str = '';
        var groupDescription = group.groupDescription || group.groupName + ' Group';
        str += '# Group ' + group.groupName + NL;
        str += groupDescription + NL + NL;
        str += routesToMD(group.routes);
        return str;
    });
    fs.writeFileSync('apiary.md',md.join(NL));
}

function findGroups() {
    var config = require(process.cwd() + '/config');
    var routes = _.map(config, function(route, name){
        return {
            groupName: name,
            groupDescription: route.description,
            routes: _.map(grunt.file.expand(route.files), function(file){
                return require(process.cwd() + '/' + file);
            })
        };
    });
    groupToMd(routes);
}

findGroups();
