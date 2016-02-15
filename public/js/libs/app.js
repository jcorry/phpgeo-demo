/**
 * Created by jcorry on 2/5/16.
 */
define(['jquery', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyB6Keo39AnB2e9hQa9lBPas8zAK_eAWpAc&libraries=places,drawing'], function($){
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
})