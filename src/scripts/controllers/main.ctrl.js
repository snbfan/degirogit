/* global angular, document */
angular.module('degirogit').controller('MainController', function($scope, $location, GithubSrv) {
    'use strict';

    var self = this;

    // number of buttons in pagination
    self.pagesInPager = 4;

    // fallback for max page number
    self.maxPageFallback = 100;

    // model for fiters
    $scope.model = {};

    // spinner trigger
    $scope.spinner = false;


    /**
     * Default filter options
     *
     * @type {}
     */
    $scope.defaults = {
        page:1,
        per_page:'25',
        language:'javascript',
        from:'YYYY-MM-DD',
        to:'YYYY-MM-DD'
    };


    /**
     * Static text for the view
     *
     * @type {}
     */
    $scope.text = {
        id: 'Id',
        reponame :'Repo name',
        language: 'Language',
        login: 'Owner login',
        perpage: 'Per page:',
        noresults: 'No results',
        to:'To:',
        from:'From:'

    };

    /**
     * Possible options for filters
     *
     * @type {}
     */
    $scope.options = {
        per_page : ['25', '50', '100' ],
        language: ['javascript','java','php','ruby','python']
    };


    /**
     * Moves us to the different page of results
     *
     * @param page
     * @returns {boolean}
     */
    $scope.moveToPage = (page) => {
        if (page <= 0 || page > $scope.maxPage) {
            return false;
        }

        $scope.model.page = page;
    };


    /**
     * Start point
     */
    self.start = () => {
        $scope.$on('$locationChangeSuccess', (event, newurl) => {
            self.parseUrl();
        });
    };


    /**
     * Makes a call to GithibSrv, populates results
     *
     */
    self.callGit = () => {
        if (Object.keys($scope.model).length === 0) {
            return;
        }

        self.showSpinner();
        GithubSrv.callGithub($scope.model).then((response) => {
            $scope.repos = response.data;
            self.processPaging(response.headers);
        }, (error) => {
            $scope.repos = [];
            //console.warn(error);
        }).finally(() => {
            self.hideSpinner();
        });
    };


    /**
     * Takes care of pagination
     *
     * @param headers
     */
    self.processPaging = (headers) => {
        if (!headers) {
            return;
        }

        var hdrs = headers.split(','),
            page = $scope.model.page;
            $scope.pagesRange = [];

        for(var i in hdrs) {
            if (hdrs[i].indexOf('rel="last"') > -1) {
                var res = /\?page=(\d*)/.exec(hdrs[i]);
                $scope.maxPage = res && res.length > 0 && parseInt(res[res.length - 1]) || self.maxPageFallback;
                break;
            }
        }

        for (var j = page; j < page + self.pagesInPager; j++) {
            if (j <= $scope.maxPage) {
                $scope.pagesRange.push(j);
            }
        }

    };


    /**
     * Parses url for params
     *
     */
    self.parseUrl = () => {

        for(var i in $scope.defaults) {
            var param = self.getParameterByName(i);
            switch(i) {
                case 'per_page':
                case 'language':
                    $scope.model[i] = $scope.options[i].indexOf(param) > -1 && param || $scope.defaults[i];
                    break;

                case 'from':
                case 'to':
                    $scope.model[i] = param || '';
                    break;

                case 'page':
                    $scope.model[i] = param && $scope.maxPage && param <= $scope.maxPage && parseInt(param) || $scope.defaults[i];
                    break;

                default:
                    $scope.model[i] = param || $scope.defaults[i];
                    break;
            }
        }
    };


    /**
     * Extract param from url hash string
     *
     * @param name
     * @param url
     * @returns {*}
     */
    self.getParameterByName = (name, url) => {
        if (!url) {
            url = document.location.hash;
        }

        var parts = url.substr(1).length > 0 && url.substr(1).split("&") || null;

        if (parts) {
            for(var i in parts) {
                var tmp = parts[i].split("=");
                if (tmp[0] === name) {
                    return decodeURIComponent(tmp[tmp.length-1]);
                }
            }
        }

        return null;
    };


    /**
     * Show spinner
     */
    self.showSpinner = () => {
        $scope.spinner = true;
    };


    /**
     * Hide spinner
     */
    self.hideSpinner = () => {
        $scope.spinner = false;
    };

    // call for new results if any of the filters has changed
    $scope.$watch("model", self.callGit, true);

    self.start();
});