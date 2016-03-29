<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use geoPHP;

class Location extends Model
{

    /**
     * @param array $where
     */
    public function listLocations($where = [])
    {
        $query = $this->select(
            \DB::raw('id, 
                    name,
                    FORMAT(ST_Y(center), 4) AS lat, 
                    FORMAT(ST_X(center), 4) AS lng, 
                    ST_AsWKT(bounds) AS bounds_wkt,
                    ST_Area(bounds) AS mysql_area')
            )->where($where);

        $data = $query->get();

        $data->each(function(&$row){
            $polygon = geoPHP::load($row->bounds_wkt);
            $row->area = $polygon->getArea();
        });

        return $data;
    }

}
