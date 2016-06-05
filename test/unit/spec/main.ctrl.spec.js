describe('Tests for main.ctrl.js : ', function () {
    'use strict';

    var scope, q, mainCtrl, GithubSrv, controller,
        hash = '#page=12341234&per_page=35&language=objectivec',
        incorrectUrlHash = {location: {hash:hash}};

    beforeEach(function () {
        module('degirogit');

        angular.mock.module(function($provide) {
            $provide.value('document', incorrectUrlHash);
        });

        inject(function ($q, $rootScope, $httpBackend, $controller, _GithubSrv_) {

            $httpBackend.when('GET',/.*api.github.com.*/).respond(200, '{}');

            q = $q;
            scope = $rootScope.$new();
            GithubSrv = _GithubSrv_;
            controller = $controller;
            mainCtrl = $controller('MainController', {
                '$scope': scope,
                'GithubSrv': GithubSrv
            });
        });
    });

    describe('when controller instantiates:', function() {
        it('should initially set some scope values', function () {
            expect(scope.model).toEqual({});
            expect(scope.spinner).toEqual(false);

            expect(Object.keys(scope.text).length).toBeGreaterThan(0);
            expect(Object.keys(scope.defaults).length).toBeGreaterThan(0);
            expect(Object.keys(scope.options).length).toBeGreaterThan(0);
        });
    });

    describe('start() method: ', function() {
        it('should make a call to $scope.$on()', function () {
            spyOn(scope, '$on');
            mainCtrl.start();
            expect(scope.$on).toHaveBeenCalled();
        });
    });

    describe('callGit() method;', function() {
        it('should return if $scope.model is not populated', function() {
            scope.model = {};

            spyOn(GithubSrv, 'callGithub');
            spyOn(mainCtrl, 'hideSpinner');

            mainCtrl.callGit();

            expect(GithubSrv.callGithub).not.toHaveBeenCalled();
            expect(mainCtrl.hideSpinner).not.toHaveBeenCalled();
        });

        it('should make a call to GithubSrv.callGithub and self.hideSpinner if $scope.model is not empty', function() {
            var param1 = {a:1};

            scope.model = param1;

            spyOn(mainCtrl, 'hideSpinner');
            spyOn(GithubSrv, 'callGithub').and.returnValue(PromiseStub(true, null));

            mainCtrl.callGit();

            expect(GithubSrv.callGithub).toHaveBeenCalledWith(param1);
            expect(mainCtrl.hideSpinner).toHaveBeenCalled();
        });

        it('should make a call to processPaging() if GithubSrv.callGithub is successful', function() {
            var param1 = {a:1}, param2 = [], param3 = '';

            scope.model = param1;

            spyOn(mainCtrl, 'processPaging');
            spyOn(GithubSrv, 'callGithub').and.returnValue(PromiseStub({data:param2, headers:param3}, null));

            mainCtrl.callGit();

            expect(mainCtrl.processPaging).toHaveBeenCalledWith(param3);
            expect(scope.repos).toEqual(param2);
        });

        it('should make a call to hideSpinner() after GithubSrv.callGithub is finished', function() {
            scope.model = {a:1};

            spyOn(mainCtrl, 'hideSpinner');
            spyOn(GithubSrv, 'callGithub').and.returnValue(PromiseStub(true, null));

            mainCtrl.callGit();

            expect(mainCtrl.hideSpinner).toHaveBeenCalled();
        });
    });

    describe('processPaging() method: ', function() {

        var headers = '<https://api.github.com/search/repositories?page=6&per_page=25&q=language%3Ajavascript>; rel="next", <https://api.github.com/search/repositories?page=40&per_page=25&q=language%3Ajavascript>; rel="last", <https://api.github.com/search/repositories?page=1&per_page=25&q=language%3Ajavascript>; rel="first", <https://api.github.com/search/repositories?page=4&per_page=25&q=language%3Ajavascript>; rel="prev"'

        it('should return if called with no parameter', function() {
            mainCtrl.processPaging();

            expect(scope.maxPage).not.toBeDefined();
            expect(scope.pagesRange).not.toBeDefined();
        });

        it('should correctly extract max page value from headers', function() {
            mainCtrl.processPaging(headers);

            expect(scope.maxPage).toEqual(40);
        });

        it('should correctly set paging numbers depending on $scope.page and $scope.maxPage', function() {
            scope.model.page = 5;

            mainCtrl.processPaging(headers);

            expect(scope.pagesRange).toEqual([5,6,7,8]);
        });
    });

    describe('parseUrl() method', function() {

        it('should make a call to .getParameterByName()', function() {
            spyOn(mainCtrl, 'getParameterByName');

            mainCtrl.parseUrl();

            expect(mainCtrl.getParameterByName).toHaveBeenCalled();
        });

        it('should populate model with default values if from hash don\'t meet the requirements', function() {
            var defaultModel = {page:1,per_page:'25',language:'javascript',from:'',to:''};
            mainCtrl.parseUrl();
            expect(scope.model).toEqual(defaultModel);
        });
    });

    describe('getParameterByName() method', function() {
        it('should correctly extract param values from hash', function() {
            expect(mainCtrl.getParameterByName('page', hash)).toEqual('12341234');
            expect(mainCtrl.getParameterByName('per_page', hash)).toEqual('35');
            expect(mainCtrl.getParameterByName('language', hash)).toEqual('objectivec');
        });

        it('should return null if no hash is present', function() {
            expect(mainCtrl.getParameterByName('language', '')).toBe(null);
        });
    });

    describe('showSpinner() and hideSpinner() methods', function() {
        it('showSpinner() should set $scope.spinner to true', function() {
            mainCtrl.showSpinner();
            expect(scope.spinner).toEqual(true);
        });
        it('hideSpinner() should set $scope.spinner to false', function() {
            mainCtrl.hideSpinner();
            expect(scope.spinner).toEqual(false);
        });
    });
});
