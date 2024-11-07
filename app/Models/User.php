<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fullname',
        'username',
        'mobile',
        'national_code',
        'image',
        'father_name',
        'address',
        'zip',
        'personally_number',
        'bimeh_number',
        'home_phone',
        'mobile_friend',
        'user_activity',
        'days_function',
        'bimeh',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * The function that create relation between "Clock" model
     *
     * @return HasMany
     */
    public function clock(): HasMany
    {
        return $this->hasMany(Clock::class);
    }

    /**
     * The function that create relation between "UserWork" model
     *
     * @return HasMany
     */
    public function work(): HasMany
    {
        return $this->hasMany(UserWorks::class);
    }

    /**
     * The function that create relation between "Salary" model
     *
     * @return HasMany
     */
    public function salary(): HasMany
    {
        return $this->hasMany(Salary::class);
    }

    /**
     * The function that create relation between "Vacation" model
     *
     * @return HasMany
     */
    public function vacation(): HasMany
    {
        return $this->hasMany(Vacation::class);
    }

    /**
     * The function that create relation between "Duty" model
     *
     * @return HasMany
     */
    public function duty(): HasMany
    {
        return $this->hasMany(Duty::class);
    }

    /**
     * The function that create relation between "WorkAtHome" model
     *
     * @return HasMany
     */
    public function work_at_home(): HasMany
    {
        return $this->hasMany(WorkAtHome::class);
    }

    /**
     * The function that create relation between "UserWorkHome" model
     *
     * @return HasMany
     */
    public function user_work_at_home(): HasMany
    {
        return $this->hasMany(UserWorkHome::class);
    }
}
