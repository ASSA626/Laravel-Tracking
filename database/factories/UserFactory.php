<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fullname' => str()->random(5),
            'username' => str()->random(5),
            'mobile' => rand(1111111111, 9999999999),
            'national_code' => rand(111111111, 999999999),
            'image' => 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png',
            'father_name' => 'مجتبی',
            'address' => 'ناکجا آباد',
            'zip' => rand(11111111, 99999999),
            'personally_number' => rand(11111111, 99999999),
            'bimeh_number' => rand(11111111, 99999999),
            'home_phone' => rand(11111111, 99999999),
            'mobile_friend' => rand(1111111111, 9999999999),
            'user_activity' => true,
            'days_function' => true,
            'bimeh' => false,
            'password' => '1010',
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
