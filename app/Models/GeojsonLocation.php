<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/15/16
 * Time: 7:59 AM
 */

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Model;


class GeojsonLocation extends Model
{
    protected $connection = 'mongodb';


    public function listLocations()
    {
        return $this->orderBy('area', 'desc')->get();
    }

    /**
     * @param $lat
     * @param $lng
     */
    public static function intersects($lat, $lng)
    {
        $object = self::whereRaw([
            'bounds' => [
                '$geoIntersects' => [
                    '$geometry' => [
                        'type' => 'Point',
                        'coordinates' => [(float)$lng, (float)$lat]
                    ]
                ]
            ]
        ])->orderBy('area', 'DESC')
        ->get();

        return $object;
    }

    /**
     * @param $lat
     * @param $lng
     */
    public static function contains($coordinates)
    {
        $object = self::whereRaw([
            'bounds' => [
                '$geoWithin' => [
                    '$geometry' => [
                        'type' => 'Polygon',
                        'coordinates' => [$coordinates]
                    ]
                ]
            ]
        ])->orderBy('area', 'DESC')
            ->get();

        return $object;
    }




}