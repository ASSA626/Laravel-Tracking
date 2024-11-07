<?php

namespace App\Helpers;

class HoursToMin
{
    public static function calculateTime($time): string
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + $minutes;
    }

    public static function calculateHours($time): string
    {
        $hours = floor($time / 60);
        $remainingMinutes = $time % 60;
        return sprintf("%02d:%02d", $hours, $remainingMinutes);
    }

    public static function sumTimes($user_works)
    {
        $totalMinutes = 0;

        foreach ($user_works as $user_work) {
            $totalMinutes += self::calculateTime($user_work->time_value);
        }

        return $totalMinutes;
    }
}
