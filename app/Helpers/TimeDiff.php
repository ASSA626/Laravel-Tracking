<?php

namespace App\Helpers;

use Carbon\Carbon;

class TimeDiff
{
    /**
     * Give the hours of between the 2 hours (custom time to now)
     * @param $start_time
     * @return string
     */
    public static function timeDeference($start_time): string
    {
        $startTime = Carbon::createFromFormat('H:i', $start_time);
        $endTime = Carbon::now()->format('H:i');
        $endTimeCarbon = Carbon::createFromFormat('H:i', $endTime);

        if ($endTimeCarbon->lessThan($startTime)) {
            $endTimeCarbon->addDay();
        }

        $diffInMinutes = $endTimeCarbon->diffInMinutes($startTime);
        $diffHours = intdiv(abs($diffInMinutes), 60);
        $diffMinutes = abs($diffInMinutes) % 60;
        return sprintf('%d:%02d', $diffHours, $diffMinutes);
    }

    /**
     * Give the hours of between the 2 hours
     * @param $start_time
     * @param $left_time
     * @return string
     */
    public static function timeDeferenceTwoTime($start_time, $left_time): string
    {
        $startTime = Carbon::createFromFormat('H:i', $start_time);
        $endTimeCarbon = Carbon::createFromFormat('H:i', $left_time);

        if ($endTimeCarbon->lessThan($startTime)) {
            $endTimeCarbon->addDay();
        }

        $diffInMinutes = $endTimeCarbon->diffInMinutes($startTime);
        $diffHours = intdiv(abs($diffInMinutes), 60);
        $diffMinutes = abs($diffInMinutes) % 60;
        return sprintf('%d:%02d', $diffHours, $diffMinutes);
    }
}
