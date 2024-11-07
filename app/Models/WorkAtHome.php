<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkAtHome extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'start_time',
        'user_work_home',
        'daily_time',
        'left_time',
        'date',
        'status',
    ];

    /**
     * The function that create relation between "User" model
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The function that create relation between "UserWorkHome" model
     *
     * @return HasMany
     */
    public function homework(): HasMany
    {
        return $this->hasMany(UserWorkHome::class);
    }
}
