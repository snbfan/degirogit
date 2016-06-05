exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/*.js'],
    capabilities: {
        browserName: "chrome",
        chromeOptions: {
            prefs: {
                "profile.default_content_setting_values.geolocation": 1
            }
        }
    }
};
