describe('Degiro Git App', function() {

    var spinnerCSS = 'span.fast-right-spinner',
        tableCSS = 'table.table',
        tableRowCSS = 'tbody tr',
        languageSelectCSS = 'select[name="language"]',
        pagesSelectCSS = 'select[name="per_page"]',
        fromCSS = 'input#from',
        toCSS = 'input#to',
        noresultsCSS = '#noresults',

        // this is where Webstorm opens my page
        localhostUrl = 'http://localhost:63342/degirogit/dist/index.html';


    describe('when page is loaded:', function() {
        beforeEach(function () {
            browser.get(localhostUrl);
            browser.sleep(500);
        });

        it('should have results displayed', function() {
            expect(element(by.css(tableCSS)).isDisplayed()).toBe(true);
            expect(element.all(by.css(tableRowCSS)).count()).toBe(25);
        });

        it('should not have a spinner displayed', function() {
            expect(element(by.css(spinnerCSS)).isDisplayed()).toBe(false);
        });

        it('should have filters with default values', function() {
            var lang = element(by.css(languageSelectCSS)).$('option:checked').getText();
            expect(lang).toEqual('javascript');

            var per_page = element(by.css(pagesSelectCSS)).$('option:checked').getText();
            expect(per_page).toEqual('25');

            var from = element(by.css(fromCSS));
            from.getAttribute('value').then(function(res) {
                expect(res).toEqual('');
            });
            from.getAttribute('placeholder').then(function(res) {
                expect(res).toEqual('YYYY-MM-DD');
            });

            var to = element(by.css(toCSS));
            to.getAttribute('value').then(function(res) {
                expect(res).toEqual('');
            });
            to.getAttribute('placeholder').then(function(res) {
                expect(res).toEqual('YYYY-MM-DD');
            });
        });

    });

    describe('when per_page value is changed: ', function() {
        it('should change the number of table rows on the page', function() {
            browser.get(localhostUrl);
            element(by.css(pagesSelectCSS)).$('option[value="50"]').click().then(function() {
                browser.sleep(1000);
                expect(element.all(by.css(tableRowCSS)).count()).toBe(50);
            });
        });
    });

    describe('when non-existent/bad query is executed', function() {
        beforeEach(function () {
            browser.get(localhostUrl);
            element(by.css(fromCSS)).sendKeys('2016-10-10');
            browser.sleep(2000);
        });

        it('should show "No results"', function() {
            expect(element(by.css(noresultsCSS)).isDisplayed()).toBe(true);
        });

        it('should not have results displayed', function() {
            expect(element(by.css(tableCSS)).isPresent()).toBe(false);
        });
    });

    describe('when the page is accessed with correct hash values', function() {
        it('should synchronize filters', function() {
            browser.get(localhostUrl + '#language=php&per_page=50');

            var lang = element(by.css(languageSelectCSS)).$('option:checked').getText();
            expect(lang).toEqual('php');

            var per_page = element(by.css(pagesSelectCSS)).$('option:checked').getText();
            expect(per_page).toEqual('50');
        });
    });

    describe('when the page is accessed with incorrect hash values', function() {
        it('should not synchronize filters', function () {
            browser.get(localhostUrl + '#language=objectivec&per_page=12341235123');

            var lang = element(by.css(languageSelectCSS)).$('option:checked').getText();
            expect(lang).toEqual('javascript');

            var per_page = element(by.css(pagesSelectCSS)).$('option:checked').getText();
            expect(per_page).toEqual('25');
        });
    });
});


