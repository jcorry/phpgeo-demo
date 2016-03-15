<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/15/16
 * Time: 9:38 AM
 */

namespace App\Repositories;

use App\Repositories\Contracts\RepositoryInterface;
use App\Repositories\Eloquent\Repository;


class LocationRepository extends Repository
{
    function model()
    {
        return 'App\Models\GeojsonLocation';
        //return 'App\Models\Location';
    }
}