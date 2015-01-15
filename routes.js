var _ = require('lodash');
var fs = require('fs');
var grunt = require('grunt');

var routes = [{
    groupName: 'billing',
    groupDescription: 'adds billing',
    routes: [{
        'route': '/billing',
        'name': 'Billing Collection',
        'methods': ['GET'],
    }, {
        'route': '/billing/{id}',
        'name': 'Single Billing Item',
        'methods': ['GET']
    }, {
        'route': '/billing/logs',
        'name': 'Log collection',
        'methods': ['GET']
    }, {
        'route': '/billing/logs/{id}',
        'name': 'Single Log',
        'methods': ['GET']
    }, {
        'route': '/billing/cards',
        'name': 'Card collection',
        'methods': ['GET', 'POST']
    }, {
        'route': '/billing/{id}/cards',
        'name': 'Single card',
        'api': [
            {
                'method': 'POST',
                'responseCode': 200,
                'description': 'Card Collection',
                'request': {
                    "creditCardId": 300,
                    "cardNumber": 300,
                    "expDate": 300,
                    "billingAddress": 'x',
                    "billingZip": 'x',
                    "billingCity": 'a',
                    "billingState": 'a'
                }
            }
        ]   
    }]
}];

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

function groupToMd() {
    var md = _.map(routes, function(group) {
        var str = '';
        var groupDescription = group.groupDescription || group.groupName + ' Group';
        str += '# Group ' + group.groupName + NL;
        str += groupDescription + NL + NL;
        str += routesToMD(group.routes);
        return str;
    });

    console.log(md.join(NL));
}

groupToMd();
