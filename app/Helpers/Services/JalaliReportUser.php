<?php

namespace App\Helpers\Services;

use App\Helpers\DateTransformer;
use App\Models\Clock;
use App\Models\DutyClock;
use App\Models\UserWorkHome;
use App\Models\UserWorks;
use App\Models\WorkAtHome;
use Carbon\Carbon;
use Exception;
use Hekmatinasser\Verta\Verta;
use Illuminate\Support\Collection;

class JalaliReportUser
{
    private int $user_id;

    public function __construct($user_id)
    {
        $this->user_id = $user_id;
    }

    /**
     * Get data from 3 of models (Clock, WorkAtHome and DutyClock)
     * @param string|null $start_date
     * @param string|null $end_date
     * @return array
     * @throws Exception
     */
    public function getMonthlyReport(?string $start_date, ?string $end_date): array
    {
        if (!$start_date || !$end_date) {
            $now = Verta::now();
            $year = $now->year;
            $month = $now->month;

            $startOfMonth = Verta::createJalali($year, $month, 1, 0, 0, 0);
            $endOfMonth = Verta::createJalali($year, $month, $now->daysInMonth, 0, 0, 0);

            $start_date = DateTransformer::shamsi_to_miladi($startOfMonth);
            $end_date = DateTransformer::shamsi_to_miladi($endOfMonth);
        }

        $clocks = Clock::query()
            ->where('user_id', $this->user_id)
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->whereBetween('date', [$start_date, $end_date])
            ->get();

        $workAtHome = WorkAtHome::query()
            ->where('user_id', $this->user_id)
            ->where('status', 'confirmed')
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->whereBetween('date', [$start_date, $end_date])
            ->get();

        $dutyClocks = DutyClock::query()
            ->where('user_id', $this->user_id)
            ->where('status', 'confirmed')
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->whereBetween('date', [$start_date, $end_date])
            ->get();

        $reports = $this->getReports($start_date, $end_date, $clocks, $workAtHome, $dutyClocks);
        $works = $this->getProjectHours($clocks, $workAtHome);

        $totalTime = $this->getTotalHours($clocks, $workAtHome, $dutyClocks);
        $totalDay = (float) $totalTime / 8;

        return [
            'reports' => $reports,
            'works'  => $works,
            'totalTime' => $totalTime,
            'totalDay' => $totalDay
        ];
    }

    /**
     * Prepare reports between start and end date.
     * @param string $start_date
     * @param string $end_date
     * @param Collection $clocks
     * @param Collection $workAtHome
     * @param Collection $dutyClocks
     * @return Collection
     */
    private function getReports(string $start_date, string $end_date, Collection $clocks, Collection $workAtHome, Collection $dutyClocks): Collection
    {
        $report = collect();

        $start = Carbon::parse($start_date);
        $end = Carbon::parse($end_date);

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $jalaliDate = Verta::instance($date)->format('Y/m/d');

            $dayClocks = $this->getEntriesForDate($clocks, $date);
            $dayWorkAtHome = $this->getEntriesForDate($workAtHome, $date);
            $dayDutyClocks = $this->getEntriesForDate($dutyClocks, $date);

            $clockTime = $this->sumDailyTimes($dayClocks);
            $workAtHomeTime = $this->sumDailyTimes($dayWorkAtHome);
            $dutyClockTime = $this->sumDailyTimes($dayDutyClocks);

            $totalTime = $this->sumTimes($clockTime, $workAtHomeTime, $dutyClockTime);

            $report->push([
                'date' => $jalaliDate,
                'start_time_clocks' => $dayClocks->first()->start_time ?? '00:00',
                'end_time_clocks' => $dayClocks->first()->left_time ?? '00:00',
                'start_time_work_at_home' => $dayWorkAtHome->first()->start_time ?? '00:00',
                'end_time_work_at_home' => $dayWorkAtHome->first()->left_time ?? '00:00',
                'start_time_duty_clock' => $dayDutyClocks->first()->start_time ?? '00:00',
                'end_time_duty_clock' => $dayDutyClocks->first()->left_time ?? '00:00',
                'total_time' => $totalTime,
            ]);
        }

        return $report;
    }

    /**
     * Prepare works of clocks
     * @param Collection $clocks
     * @param Collection $workAtHome
     * @return array
     */
    private function getProjectHours(Collection $clocks, Collection $workAtHome): array
    {
        $projectHours = [];

        foreach ($clocks as $clock) {
            $userWorks = UserWorks::query()->where('clock_id', $clock->id)->first();

           if ($userWorks) {
               $projectName = $userWorks->project;
               $projectHours[$projectName]['project'] = $projectName;
               $projectHours[$projectName]['time'] = $this->sumTimes($projectHours[$projectName]['time'] ?? '00:00', $userWorks->time_value);
           }
        }

        foreach ($workAtHome as $homework) {
            $userWorksHome = UserWorkHome::query()->where('work_at_homes_id', $homework->id)->first();

            if ($userWorksHome) {
                $projectName = $userWorksHome->project;
                $projectHours[$projectName]['project'] = $projectName;
                $projectHours[$projectName]['time'] = $this->sumTimes($projectHours[$projectName]['time'] ?? '00:00', $userWorksHome->time_value);
            }
        }

        return array_values($projectHours);
    }

    /**
     * Filter entries for a specific date.
     * @param Collection $entries
     * @param Carbon $date
     * @return Collection
     */
    private function getEntriesForDate(Collection $entries, Carbon $date): Collection
    {
        return $entries->filter(function ($entry) use ($date) {
            return Carbon::parse($entry->date)->isSameDay($date);
        });
    }

    /**
     * Get All daily time and sum there
     * @param Collection $clocks
     * @param Collection $workAtHome
     * @param Collection $dutyClocks
     * @return string
     */
    private function getTotalHours(Collection $clocks, Collection $workAtHome, Collection $dutyClocks): string
    {
        $totalTime = '00:00';
        if ($clocks->isNotEmpty()) {
            $totalTime = $this->sumDailyTimes($clocks);
        }
        if ($workAtHome->isNotEmpty()) {
            $totalTime = $this->sumTimes($totalTime, $this->sumDailyTimes($workAtHome));
        }
        if ($dutyClocks->isNotEmpty()) {
            $totalTime = $this->sumTimes($totalTime, $this->sumDailyTimes($dutyClocks));
        }
        return $totalTime;
    }

    /**
     * Sum the daily times.
     * @param Collection $entries
     * @return string
     */
    private function sumDailyTimes(Collection $entries): string
    {
        $totalTime = '00:00';
        foreach ($entries as $entry) {
            $totalTime = $this->sumTimes($totalTime, $entry->daily_time);
        }
        return $totalTime;
    }

    /**
     * Sum two or three times together.
     * @param string $time1
     * @param string $time2
     * @param string $time3
     * @return string
     */
    private function sumTimes(string $time1, string $time2, string $time3 = '00:00'): string
    {
        $totalMinutes = $this->toMinutes($time1) + $this->toMinutes($time2) + $this->toMinutes($time3);

        $hours = floor($totalMinutes / 60);
        $minutes = $totalMinutes % 60;

        return sprintf('%02d:%02d', $hours, $minutes);
    }

    /**
     * Convert a time string to minutes.
     * @param string $time
     * @return float|int
     */
    private function toMinutes(string $time): float|int
    {
        list($hours, $minutes) = explode(':', $time);
        return ($hours * 60) + $minutes;
    }
}
