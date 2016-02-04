var elixir = require('laravel-elixir');
var gulp = require('gulp');

gulp.task('fonts', function() {
    return gulp.src([
            './bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-*'])
        .pipe(gulp.dest('./public/fonts/bootstrap'));
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

elixir(function(mix) {
    mix.sass('app.scss')
        .version('css/app.css');
});
