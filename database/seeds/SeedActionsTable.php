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

        $maxLat = 33.9456;
        $minLat = 33.5746;

        $maxLng = -84.2266;
        $minLng = -84.5246;

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
                'data' => json_encode($data),
                'created_at' => $created_at
            ]);

        }

    }
}
