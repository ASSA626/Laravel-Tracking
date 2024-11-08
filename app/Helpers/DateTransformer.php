<?php

namespace App\Helpers;

use DateTime;
use Hekmatinasser\Verta\Verta;

class DateTransformer
{
    /**
     * Exchange shamsi date to miladi
     * @param $date
     * @return string
     */
    public static function shamsi_to_miladi($date): string
    {
        $s_year = Verta::parse($date)->year;
        $s_month = Verta::parse($date)->month;
        $s_day = Verta::parse($date)->day;
        $start_date = Verta::jalaliToGregorian($s_year, $s_month, $s_day);
        $date = strtotime($start_date[0].'/'.$start_date[1].'/'.$start_date[2]);
        return date('Y-m-d', $date);
    }

    /**
     * Exchange miladi date to shamsi
     * @param $date
     * @return DateTime
     */
    public static function miladi_to_shamsi($date): DateTime
    {
        $s_year = Verta::parse($date)->year;
        $s_month = Verta::parse($date)->month;
        $s_day = Verta::parse($date)->day;
        $start_date = Verta::GregorianToJalali($s_year, $s_month, $s_day);
        $date1 = strtotime($start_date[0].'/'.$start_date[1].'/'.$start_date[2]);
        $date2 = date('Y-m-d', $date1);
        return DateTime::createFromFormat('Y-m-d', $date2);
    }
}
