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
Route::get('/api/v1/mysql/locations', 'LocationsController@listLocations');
Route::get('/api/v1/mongo/locations', 'LocationsController@listLocations');

Route::post('/api/v1/mysql/locations', 'LocationsController@create');
Route::put('/api/v1/mysql/locations/{id}', 'LocationsController@update');
Route::delete('/api/v1/mysql/locations/{id}', 'LocationsController@delete');
Route::get('/api/v1/mysql/locations/intersects', 'LocationsController@intersects');
Route::get('/api/v1/mysql/locations/contains', 'LocationsController@contains');

Route::get('/api/v1/mysql/actions', 'ActionsController@listActions');
Route::post('/api/v1/mysql/actions', 'ActionsController@create');
Route::put('/api/v1/mysql/actions/{id}', 'ActionsController@update');
Route::delete('/api/v1/mysql/actions/{id}', 'ActionsController@delete');
Route::get('/api/v1/mysql/actions/intersects', 'ActionsController@intersects');
Route::get('/api/v1/mysql/actions/contains', 'ActionsController@contains');

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
