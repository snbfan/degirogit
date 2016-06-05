/* global angular */
angular.module('degirogit').service('GithubSrv', function($q, $http) {
    'use strict';

    var self = this;

    /**
     * Call object template to be enriched depending on the call
     *
     * @type {}
     */
    self.githubTpl = {
        method: 'GET',
        url: 'https://api.github.com/search/repositories',
        headers: {
            'Authorization': 'token 19fc004c7f1e9f1d2a6403d07598cbb94125f500'
        }
    };


    /**
     * Creates search string for Github API
     *
     * @param model
     * @returns {}
     */
    self.createRequestObject = (model) => {

        var currentTpl = angular.copy(self.githubTpl),
            getVars = [], q = [], from = '', to = '';

        for(var i in model) {

            if (model[i] !== undefined) {
                switch (i) {
                    case 'language':
                        q.push(i + ':' + model[i]);
                        break;
                    case 'from':
                        from = model[i].length && model[i] || '*';
                        break;
                    case 'to':
                        to = model[i].length && model[i] || '*';
                        break;
                    default:
                        getVars.push(i + '=' + model[i]);
                        break;
                }
            }
        }

        // add "created" part if dates are set
        if (from !== '*' || to !== '*') {
            q.push('created:"' + from + ' .. ' + to + '"');
            getVars.push('type=Repositories');
        }

        // add query part if set
        if (q.length) {
            getVars.push('q=' + q.join(encodeURI("+")));
        }

        currentTpl.url += getVars.length ? '?' + getVars.join("&") : '';

        return currentTpl;

    };


    /**
     * Makes a call to Github API
     *
     * @returns {Promise}
     */
    self.callGithub = (model) => {
        var deferred = $q.defer(),
            requestObj = self.createRequestObject(model);

        $http(requestObj)
            .success((data, status, headers) => {
                deferred.resolve({data: data.items, headers: headers().link || null});
            })
            .error((data) => {
                deferred.reject(data && data.message || 'Server error');
            });

        return deferred.promise;

    };
});
