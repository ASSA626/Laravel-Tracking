<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Duty extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date_of_request',
        'of_date',
        'to_date',
        'project',
        'place',
        'transporter',
        'description',
        'status'
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
     * The function that create relation between "DutyClock" model
     *
     * @return HasMany
     */
    public function duty_clock(): HasMany
    {
        return $this->hasMany(DutyClock::class);
    }
}
