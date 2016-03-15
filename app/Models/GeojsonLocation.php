<?php
/**
 * Created by PhpStorm.
 * User: jcorry
 * Date: 3/15/16
 * Time: 7:59 AM
 */

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;


class GeojsonLocation extends Eloquent
{
    protected $connection = 'mongodb';


}