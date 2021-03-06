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


    /**
     * @param Request $request
     */
    public function inRadius(Request $request)
    {
        $collection = $this->model->getByRadius($request->input('lat'), $request->input('lng'), $request->input('radius'));

        $area = M_PI * pow($request->input('radius'), 2);

        return Response::json(['points' => $collection, 'area' => $area]);
    }

    /**
     *
     */
    public function within(Request $request)
    {
        $start = microtime(true);

        if(str_contains($request->path(), 'mongo')) {
            $collection = $this->model->within($request->json('geometry.coordinates'));
            $elapsed = microtime(true) - $start;
        } else {
            $geometry = \geoPHP::load($request->input('geometry'), 'wkt');
            $collection = $this->model->within($geometry->asText('wkt'));
            $elapsed = microtime(true) - $start;
        }

        $logMessage = 'ms to get %s data: %f in %s';

        \Log::debug(sprintf($logMessage, str_contains($request->path(), 'mongo') ? 'Mongo' : 'PostGIS', $elapsed, 'within()'));

        return Response::json(['points' => $collection, 'area' => 0]);
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
