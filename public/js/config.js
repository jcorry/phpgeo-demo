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
        },
        app: {
            deps: ['jquery']
        },
        "jquery.spin" : {
            deps: ['spin', 'jquery']
        }
    },
    paths: {
        async: 'libs/async',
        global: "libs/app",
        backbone: "libs/backbone",
        bootstrap : "libs/bootstrap",
        datatables: "libs/jquery.dataTables",
        jquery: "libs/jquery",
        moment: 'libs/moment',
        moment_tz: 'libs/moment-timezone/builds/moment-timezone-with-data',
        underscore: 'libs/underscore',
        spin : 'libs/spin',
        "jquery.spin" : 'libs/jquery.spin',
        app: 'libs/app',

        /** || Views || */
        home: "views/home",
        map: "views/map"
    }
}