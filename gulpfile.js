var elixir = require('laravel-elixir');
var gulp = require('gulp');
var merge = require('merge-stream');


gulp.task('fonts', function() {
    var bootstrap = gulp.src(['./vendor/bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-*'])
        .pipe(gulp.dest('./public/fonts/bootstrap'));

    var fontawesome = gulp.src(['./vendor/bower_components/font-awesome/fonts/fontawesome-webfont.*'])
        .pipe(gulp.dest('./public/build/fonts'));

    return merge(bootstrap, fontawesome);
});

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

var paths = {
    "bootstrap" : "vendor/bower_components/bootstrap-sass/assets/",
    "datatables" : "vendor/bower_components/datatables/media/",
    "backbone" : "vendor/bower_components/backbone/",
    "fontawesome" : "vendor/bower_components/font-awesome/",
    "jquery" : "vendor/bower_components/jquery/dist/",
    "moment" : "vendor/bower_components/moment/",
    "moment-tz" : "vendor/bower_components/moment-timezone/",
    "require" : "vendor/bower_components/requirejs/",
    "require-plugins" : "vendor/bower_components/requirejs-plugins/",
    "spin" : "vendor/bower_components/spin.js/",
    "underscore" : "vendor/bower_components/underscore/",
    "wicket" : "vendor/bower_components/Wicket/"
}

elixir(function(mix) {
    mix.sass('app.scss', null, {
        includePaths: [
            paths.bootstrap + 'stylesheets/',
            paths.fontawesome + 'scss/'
        ],
        loadPath: [paths.bootstrap + 'stylesheets/', paths.fontawesome + 'scss/']
    })
    .styles([
        paths.datatables + 'css/dataTables.bootstrap.css',
        paths.datatables + 'css/jquery.dataTables.css'
    ], 'public/css/vendor.css', './')
    .styles([
        "vendor.css",
        "app.css"
    ], 'public/css/app.css', 'public/css')
    .copy(
        paths['require-plugins'] + 'src/async.js',
        'public/js/libs/async.js'
    )
    .copy(
        paths.jquery + 'jquery.js',
        'public/js/libs/jquery.js'
    )
    .copy(
        paths.bootstrap + 'javascripts/bootstrap.js',
        'public/js/libs/bootstrap.js'
    )
    .copy(
        paths.datatables + 'js/jquery.dataTables.js',
        'public/js/libs/jquery.dataTables.js'
    )
    .copy(
        paths.underscore + 'underscore.js',
        'public/js/libs/underscore.js'
    )
    .copy(
        paths.backbone + 'backbone.js',
        'public/js/libs/backbone.js'
    )
    .copy(
        paths.spin + 'spin.js',
        'public/js/libs/spin.js'
    )
    .copy(
        paths.spin + 'jquery.spin.js',
        'public/js/libs/jquery.spin.js'
    )
    .copy(
        paths.wicket + 'wicket.js',
        'public/js/libs/wicket.js'
    )
    .copy(
        paths.wicket + 'wicket-gmap3.js',
        'public/js/libs/wicket-gmap3.js'
    );

    mix.version('css/app.css');
});
