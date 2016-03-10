/**
 * Created by jcorry on 2/5/16.
 */

$.ajaxSetup({
    cache: false,
    beforeSend : function(xhr) {
        console.log('adding csrf token to ajaxRequest');
        xhr.setRequestHeader('X-XSRF-Token', $('meta[name="_token"]').attr('content'));
    }
});

(function ($) {
    $.whenAll = function (deferreds) {
        if (deferreds && deferreds.length) {
            var deferred = $.Deferred(),
                toResolve = deferreds.length,
                someFailed = false,
                fail,
                always;
            always = function () {
                if (!--toResolve) {
                    deferred[someFailed ? 'reject' : 'resolve']();
                }
            };
            fail = function () {
                someFailed = true;
            };
            deferreds.forEach(function (d) {
                d.fail(fail).always(always);
            });
            return deferred;
        } else {
            return $.Deferred().resolve();
        }
    };
}(jQuery));