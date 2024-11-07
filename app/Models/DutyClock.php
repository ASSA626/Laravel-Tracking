<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DutyClock extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'duty_id',
        'start_time',
        'daily_time',
        'left_time',
        'date',
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
     * The function that create relation between "User" model
     *
     * @return BelongsTo
     */
    public function duty(): BelongsTo
    {
        return $this->belongsTo(Duty::class);
    }
}
