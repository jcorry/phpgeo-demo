<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('home');


});

/** API Routes */
Route::get('/mysql/locations/containing/{lat}/{lng}', 'LocationsController@contains');

Route::get('/mongo/locations/containing/{lat}/{lng}', 'LocatinsController@mongoContains');


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::group(['middleware' => ['web']], function () {
    //
    Route::get('/map', function(){
        return view('map', ['page' => 'map']);
    });

    // save the location to both mongo and 
    Route::post('/locations/save', 'LocationsController@save');
    Route::get('/locations/list', 'LocationsController@listLocations');
});
