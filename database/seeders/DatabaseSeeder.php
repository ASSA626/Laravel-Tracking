<?php

namespace Database\Seeders;

use App\Models\Clock;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(5)->create();

        User::factory()->create([
            'fullname' => 'admin',
            'username' => 'admin',
            'mobile' => '09026654648',
            'national_code' => '037342563',
            'image' => 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png',
            'father_name' => 'یادم نمیاد',
            'address' => 'ناکجا آباد',
            'zip' => '1252658562',
            'personally_number' => '32524785965324',
            'bimeh_number' => '3247859632458',
            'home_phone' => '02532813051',
            'mobile_friend' => '09217154585',
            'user_activity' => true,
            'days_function' => true,
            'bimeh' => false,
            'password' => '1387',
            'role' => 'admin'
        ]);

        // Clock::factory()->create([
        //     'user_id' => 2,
        //     'start_time' => '09:30',
        //     'user_work' => true,
        //     'daily_time' => '5:00',
        //     'left_time' =>'14:30'
        // ]);
    }
}
