<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Response;
use Illuminate\Http\Request;

use App\Http\Requests;

class ActionsController extends Controller
{
    public function __construct(Request $request)
    {
        if(str_contains($request->path(), 'postgis')) {
            $this->model = new \App\Models\Action();
        }

        if(str_contains($request->path(), 'mongo')) {
            $this->model = new \App\Models\GeojsonAction();
        }
    }

    //
    public function listActions() {
        $collection = $this->model->select(\DB::raw('
            data,
            ST_X(location) AS lng,
            ST_Y(location) AS lat,
            ST_AsText(location) AS location
        '))
            ->get();

        return Response::json($collection);
    }

    public function create() {
        $start = microtime(true);



        $elapsed = microtime(true) - $start;
    }

    public function update() {
        $start = microtime(true);



        $elapsed = microtime(true) - $start;
    }

    public function delete() {
        $start = microtime(true);



        $elapsed = microtime(true) - $start;
    }
}
