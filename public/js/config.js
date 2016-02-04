/**
 * Created by jcorry on 2/4/16.
 */
var require = {
    urlArgs : "version=0.0.1",
    waitSeconds : 2,
    baseUrl : '/js',
    shim : {
        datatables: {
            deps: ['jquery']
        },
        moment_tz: {
            deps: ['moment']
        }
    },
    paths: {
        app: "libs/app",
        backbone: "libs/backbone/backbone",
        bootstrap : "libs/bootstrap-sass/assets/javascripts/bootstrap",
        datatables: "libs/datatables/media/js/jquery.dataTables",
        jquery: "libs/jquery/dist/jquery",
        moment: 'libs/moment/moment',
        moment_tz: 'libs/moment-timezone/builds/moment-timezone-with-data',
        underscore: 'libs/underscore/underscore',
        spin: 'libs/spin.js/spin',

        /** || Views || */
        home: "views/home"
    }
}