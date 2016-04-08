<?php

use Illuminate\Database\Seeder;


class SeedActionsTable extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();

        $maxLat = 34.9456;
        $minLat = 31.2746;

        $maxLng = -85.1266;
        $minLng = -83.2246;

        $actions = [
            'check_in',
            'query',
            'comment',
            'post'
        ];

        for($i = 0; $i < 200; $i++) {
            $lat = $faker->randomFloat(4, $minLat, $maxLat);
            $lng = $faker->randomFloat(4, $minLng, $maxLng);
            $created_at = $faker->dateTimeBetween("-1 years", "now");
            $data = [
                'action' => $actions[$faker->numberBetween(0, 3)]
            ];

            \App\Models\Action::insert([
                'location' => \DB::raw("ST_SetSRID(ST_PointFromText('POINT(" . $lng . ' ' . $lat . ")'), 4326)"),
                'data' => json_encode($data)
            ]);

            $geojson = new \stdClass();
            $geojson->type = "Point";
            $geojson->coordinates = [$lng, $lat];

            $geojsonAction = new \App\Models\GeojsonAction();
            $geojsonAction->location = $geojson;
            $geojsonAction->data = $data;
            $geojsonAction->save();
        }

    }
}
