<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/18/16
 * Time: 1:40 PM
 */

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Model;


class GeojsonAction extends Model
{

    protected $connection = 'mongodb';

    public function within($coordinates)
    {
        $object = self::whereRaw([
            'location' => [
                '$geoWithin' => [
                    '$geometry' => [
                        'type' => 'Polygon',
                        'coordinates' => [$coordinates]
                    ]
                ]
            ]
        ])->orderBy('id', 'DESC')
            ->get();

        return $object;
    }
}