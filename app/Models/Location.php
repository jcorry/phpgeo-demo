<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use geoPHP;

class Location extends Model
{

    protected $connection = 'postgis';
    /**
     * @param array $where
     */
    public function listLocations($where = [])
    {
        $query = $this->select(
            \DB::raw('id, 
                    name,
                    description,
                    trim(to_char(ST_Y(center), \'999D9999\')) AS lat, 
                    trim(to_char(ST_X(center), \'999D9999\')) AS lng, 
                    ST_AsText(bounds) AS bounds_wkt,
                    ST_Area(bounds, true)/1000000 AS area_sq_km')
            )->where($where);

        $data = $query->get();

        $data->each(function(&$row){
            $polygon = geoPHP::load($row->bounds_wkt);
            $row->area = $polygon->getArea();
        });

        return $data;
    }

    /**
     * @param $lat
     * @param $lng
     */
    public static function intersects($lat, $lng)
    {
        $query = self::select(
            \DB::raw('id, 
                    name,
                    description,
                    to_char(ST_Y(center), \'999D9999\') AS lat, 
                    to_char(ST_X(center), \'999D9999\') AS lng, 
                    ST_AsText(bounds) AS bounds_wkt,
                    ST_Area(bounds, true)/1000^2 AS area_sq_km')
        )->whereRaw('ST_Intersects(ST_SetSRID(ST_MakePoint(' . $lng . ', ' . $lat . '), 4326), bounds)');

        return $query->get();
    }

    public static function contains($geometry)
    {
        $query = self::select(
            \DB::raw('id, 
                    name,
                    description,
                    to_char(ST_Y(center), \'999D9999\') AS lat, 
                    to_char(ST_X(center), \'999D9999\') AS lng, 
                    ST_AsText(bounds) AS bounds_wkt,
                    ST_Area(bounds, true)/1000^2 AS area_sq_km,
                    ST_Area(ST_SetSRID(ST_PolygonFromText(?), 4326), true)/1000^2 AS search_area_sq_km')
        )->whereRaw('ST_Contains(ST_SetSRID(ST_PolygonFromText(?), 4326), bounds)', [$geometry, $geometry]);

        return $query->get();
    }

    public static function distance($locationId)
    {
        $query = \DB::select(\DB::raw('SELECT dest.id, dest.description, FORMAT(ST_Y(dest.center), 4) AS lat, FORMAT(ST_X(dest.center), 4) AS lng,
        3956 * 2 * ASIN(SQRT( POWER(SIN(( ST_Y(orig.center) - ST_Y(dest.center)) *  pi()/180 / 2), 2) +COS(ST_Y(orig.center) * pi()/180) * COS(ST_Y(dest.center) * pi()/180) * POWER(SIN((ST_X(orig.center) - ST_X(dest.center)) * pi()/180 / 2), 2) ))
        AS distance
        FROM locations dest, locations orig
        WHERE orig.id = :id'), ['id' => $locationId]);

        return $query;
    }

    /**
     * @param $lat
     * @param $lng
     */
    public static function nearest($lat, $lng)
    {
        return \DB::select(\DB::raw('
          SELECT *, distance(:lat, :lng) AS distance FROM locations
        '), ['lat' => $lat, 'lng' => $lng]);
        
    }

    /**
     * @param $geometryWkt
     * @param string $units
     * https://www.easycalculation.com/area/learn-polygon.php
     */
    public static function areaOfPolygon($geometryWkt, $units = 'mi')
    {

    }



}
