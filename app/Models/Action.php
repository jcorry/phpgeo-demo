<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/18/16
 * Time: 1:40 PM
 */
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    protected $connection = 'postgis';

    /**
     * @param $lat
     * Float, the latitude of the search area
     * @param $lng
     * Float, the longitude of the search area
     * @param $radius
     * Float, the radius of the circle (in units)
     */
    public function getByRadius($lat, $lng, $radius)
    {
        $lat = (float)$lat;
        $lng = (float)$lng;
        $radius = (float)$radius;

        $query = $this->select(\DB::raw('id,
                data,
                trim(to_char(ST_Y(location), \'999D9999\')) AS lat, 
                trim(to_char(ST_X(location), \'999D9999\')) AS lng')
        )->whereRaw('ST_DWithin(location, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?, true)', [$lng, $lat, $radius]);

        $collection = $query->get();

        $collection->each(function(&$row){
            $row->data = json_decode($row->data);
        });

        return $collection;
    }

    /**
     * @param $geometry
     * WKT
     */
    public function within($geometry)
    {
        $query = self::select(
            \DB::raw('id, 
                    data,
                    created_at,
                    to_char(ST_Y(location), \'999D9999\') AS lat, 
                    to_char(ST_X(location), \'999D9999\') AS lng, 
                    ST_AsText(location) AS location_wkt')
        )->whereRaw('ST_Within(location, ST_SetSRID(ST_PolygonFromText(?), 4326))', [$geometry]);

        return $query->get();
    }
}