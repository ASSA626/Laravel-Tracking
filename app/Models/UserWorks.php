<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWorks extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'clock_id',
        'time_value',
        'project',
        'description',
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
     * The function that create relation between "Clock" model
     *
     * @return BelongsTo
     */
    public function clock(): BelongsTo
    {
        return $this->belongsTo(Clock::class);
    }
}
