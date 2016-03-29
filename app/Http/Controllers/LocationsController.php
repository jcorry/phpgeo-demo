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

    private $location;

    public function __construct(Request $request)
    {
        if(str_contains($request->path(), 'mysql')) {
            $this->model = new \App\Models\Location();
        }

        if(str_contains($request->path(), 'mongo')) {
            $this->model = new \App\Models\GeojsonLocation();
        }

    }

    /**
     *
     */
    public function listLocations()
    {
        $out = [
            'data' => null
        ];

        $out['data'] = $this->model->listLocations();


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
            $geojsonLocation = new \App\Models\GeojsonLocation;
        } else {
            $location = \App\Models\Location::find($request->input('id'));
            $geojsonLocation = \App\Models\GeojsonLocation::find($request->input('id'));
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

        // save it in the mongo model too...
        $geojsonLocation->name = $request->input('name');
        $geojsonLocation->description = $request->input('description');
        $geojsonLocation->area = $area;

        // save the center as GeoJSON
        $centroidWkt = \geoPHP::load('POINT(' . $centroid->getX() . ' ' . $centroid->getY() . ')', 'wkt');
        $geojsonLocation->center = json_decode($centroidWkt->out('json'));

        // save the geometry as geoJSON
        $geojsonLocation->bounds = json_decode($polygon->out('json'));
        $geojsonLocation->save();


        $out['data']['location'] = $location;
        $out['data']['geojsonLocation'] = $geojsonLocation;


        return Response::json($out);
    }

    /**
     * @param Request $request
     */
    public function contains(Request $request)
    {

    }
}