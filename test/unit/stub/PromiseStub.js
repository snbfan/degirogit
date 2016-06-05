var PromiseStub = function (successData, errorData) {
    return {
        then: function(success, error) {
            successData && success(successData);
            errorData && error(errorData);
            return {
                finally: function(f) {
                    f && f();
                }
            }
        }
    }
};