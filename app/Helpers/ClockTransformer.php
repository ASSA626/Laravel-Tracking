<?php

namespace App\Helpers;

use Carbon\Carbon;

class ClockTransformer
{
    /**
     * Exchange shamsi clock to UTC
     * @param string $time
     * @param string $timezone
     * @return string
     */
    public static function shamsi_to_UTC(string $time, string $timezone = 'Asia/Tehran'): string
    {
        $carbonTime = Carbon::createFromFormat('H:i', $time, $timezone);
        return $carbonTime->setTimezone('UTC')->format('H:i');
    }

    /**
     * Exchange UTC clock to shamsi
     */
    public static function utc_to_shamsi()
    {

    }
}
