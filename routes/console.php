<?php

use Illuminate\Support\Facades\Schedule;
use App\Helpers\Schedule\UpdateClockSchedule;

Schedule::call(new UpdateClockSchedule())
    ->timezone('Asia/Tehran')
    ->dailyAt('23:59');
