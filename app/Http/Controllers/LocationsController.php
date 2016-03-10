<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/1/16
 * Time: 6:58 PM
 */

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class LocationsController extends Controller
{

    /**
     *
     */
    public function listLocations()
    {
        $out = [
            'data' => null
        ];

        $locations  = \App\Models\Location::select(\DB::raw('name, FORMAT(ST_Y(center), 4) AS lat, FORMAT(ST_X(center), 4) AS lng'))
            ->get();

        $out['data'] = $locations;

        return Response::json($out);
    }

    /**
     *
     */
    public function save(Request $request)
    {
        $out = [
            'data' => $request->input()
        ];

        if(!$request->has('id')) {
            $location = new \App\Models\Location;
        } else {
            $location = \App\Models\Location::find($request->input('id'));
        }

        $location->name = $request->input('name');
        $location->description = $request->input('description');

        // get the center
        $geometry = $request->input('geometryWkt');
        $polygon = \geoPHP::load($geometry);
        $centroid = $polygon->getCentroid();
        $area = $polygon->getArea();

        $location->center = \DB::raw("PointFromText('POINT(" . $centroid->getX() . ' ' . $centroid->getY() . ")')");
        $location->bounds = \DB::raw("PolyFromText('" . $geometry . "')");
        $location->area = $area;

        $location->save();
        
        return Response::json($out);
    }
}