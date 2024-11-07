<?php

namespace App\Helpers\Schedule;

use App\Models\Clock;
use App\Models\DutyClock;
use App\Models\WorkAtHome;

class UpdateClockSchedule
{
    public function __invoke(): void
    {
        $clocks = Clock::query()->whereNull('left_time')->get();
        $workathomes = WorkAtHome::query()->whereNull('left_time')->get();
        $dutyclocks = DutyClock::query()->whereNull('left_time')->get();

        foreach ($clocks as $clock) {
            $clock->update([
                'left_time' => 'ساعت خروج ثبت نشده',
                'user_work' => false,
                'daily_time' => 'محاسبه نشده است',
            ]);
        }

        foreach ($workathomes as $workathome) {
            $workathome->update([
                'left_time' => 'ساعت خروج ثبت نشده',
                'user_work_home' => false,
                'daily_time' => 'محاسبه نشده است',
            ]);
        }

        foreach ($dutyclocks as $dutyclock) {
            $dutyclock->update([
                'left_time' => 'ساعت خروج ثبت نشده',
                'daily_time' => 'محاسبه نشده است',
            ]);
        }
    }
}
