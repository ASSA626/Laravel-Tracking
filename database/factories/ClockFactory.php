<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Clock>
 */
class ClockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 2,
            'start_time' => '09:30',
            'user_work' => true,
            'daily_time' => '5:00',
            'left_time' =>'14:30'
        ];
    }
}
