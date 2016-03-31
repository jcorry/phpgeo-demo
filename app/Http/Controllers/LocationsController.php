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
        if(str_contains($request->path(), 'postgis')) {
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
        $polygon->setSRID(4326);

        $srid = $polygon->SRID();
        $geos = \geoPHP::geosInstalled();
        $valid = $polygon->checkValidity();

        $centroid = $polygon->getCentroid();
        $area = $polygon->getArea();

        $location->center = \DB::raw("ST_SetSRID(ST_PointFromText('POINT(" . $centroid->getX() . ' ' . $centroid->getY() . ")'), 4326)");
        $location->bounds = \DB::raw("ST_SetSRID(ST_PolygonFromText('" . $geometry . "'), 4326)");
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
    public function intersects(Request $request)
    {
        $start = microtime(true);

        $object = $this->model->intersects($request->input('lat'), $request->input('lng'));

        $elapsed = microtime(true) - $start;

        $logMessage = 'ms to get %s data: %f in %s';

        \Log::debug(sprintf($logMessage, str_contains($request->path(), 'mongo') ? 'Mongo' : 'PostGIS', $elapsed, 'intersects'));


        return Response::json($object);
    }

    /**
     * @param Request $request
     */
    public function contains(Request $request)
    {
        $start = microtime(true);
        if(str_contains($request->path(), 'mongo')) {
            $object = $this->model->contains($request->json('geometry.coordinates'));
            $elapsed = microtime(true) - $start;
        } else {
            $geometry = \geoPHP::load($request->input('geometry'), 'wkt');
            $object = $this->model->contains($geometry->asText('wkt'));
            $elapsed = microtime(true) - $start;
        }

        $logMessage = 'ms to get %s data: %f in %s';

        \Log::debug(sprintf($logMessage, str_contains($request->path(), 'mongo') ? 'Mongo' : 'PostGIS', $elapsed, 'contains'));

        return Response::json($object);
    }
}