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


}