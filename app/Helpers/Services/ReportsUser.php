<?php

namespace App\Helpers\Services;

use App\Models\Clock;
use App\Models\DutyClock;
use App\Models\WorkAtHome;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReportsUser
{
    private int $user_id;

    public function __construct(int $user_id)
    {
        $this->user_id = $user_id;
    }

    /**
     * Get data from 3 of models (Clock, WorkAtHome and DutyClock)
     * @param string|null $start_date
     * @param string|null $end_date
     * @return LengthAwarePaginator
     */
    public function reports(?string $start_date, ?string $end_date): LengthAwarePaginator
    {
        $clocks = Clock::query()
            ->where('user_id', $this->user_id)
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->when($start_date && $end_date, function ($query) use ($start_date, $end_date) {
                $query->whereBetween('date', [$start_date, $end_date]);
            })
            ->orderBy('date', 'ASC')
            ->get();

        $homework = WorkAtHome::query()
            ->where('user_id', $this->user_id)
            ->where('status', 'confirmed')
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->when($start_date && $end_date, function ($query) use ($start_date, $end_date) {
                $query->whereBetween('date', [$start_date, $end_date]);
            })
            ->orderBy('date', 'ASC')
            ->get();

        $dutyClock = DutyClock::query()
            ->where('user_id', $this->user_id)
            ->where('status', 'confirmed')
            ->whereNotNull('left_time')
            ->whereNot('left_time', 'ساعت خروج ثبت نشده')
            ->when($start_date && $end_date, function ($query) use ($start_date, $end_date) {
                $query->whereBetween('date', [$start_date, $end_date]);
            })
            ->orderBy('date', 'ASC')
            ->get();

        $reports = $this->groupEntriesByDate($clocks, $homework, $dutyClock);
        return $this->paginateCollection($reports, 10);
    }

    /**
     * Change models to Collections and merge after map this data's
     * @param Collection $clocks
     * @param Collection $homework
     * @param Collection $dutyClock
     * @return Collection
     */
    private function groupEntriesByDate(Collection $clocks, Collection $homework, Collection $dutyClock): Collection
    {
        $allDates = $clocks->pluck('date')
            ->merge($homework->pluck('date'))
            ->merge($dutyClock->pluck('date'))
            ->map(function ($date) {
                return Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->sort();

        return $this->prepareEntries($allDates, $clocks, $homework, $dutyClock);
    }

    /**
     * Start a foreach and Collection all data's
     * @param Collection $dates
     * @param Collection $clocks
     * @param Collection $homework
     * @param Collection $dutyClock
     * @return Collection
     */
    private function prepareEntries(Collection $dates, Collection $clocks, Collection $homework, Collection $dutyClock): Collection
    {
        $entriesByDate = collect();

        foreach ($dates as $date) {
            $dayClocks = $clocks->filter(fn ($entry) => Carbon::parse($entry->date)->format('Y-m-d') === $date);
            $dayHomeworks = $homework->filter(fn ($entry) => Carbon::parse($entry->date)->format('Y-m-d') === $date);
            $dayDutyClocks = $dutyClock->filter(fn ($entry) => Carbon::parse($entry->date)->format('Y-m-d') === $date);

            $totalClockTime = $this->sumDailyTimes($dayClocks);
            $totalWorkAtHomeTime = $this->sumDailyTimes($dayHomeworks);
            $totalDutyClockTime = $this->sumDailyTimes($dayDutyClocks);

            $totalTime = $this->sumTimes($totalClockTime, $totalWorkAtHomeTime, $totalDutyClockTime);

            $entriesByDate->push([
                'date' => $date,
                'clocks' => $totalClockTime ?: '00:00',
                'homeworks' => $totalWorkAtHomeTime ?: '00:00',
                'duty_clocks' => $totalDutyClockTime ?: '00:00',
                'total_time' => $totalTime ?: '00:00',
            ]);
        }

        return $entriesByDate;
    }

    /**
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
     * @param string $time
     * @return float|int
     */
    private function toMinutes(string $time): float|int
    {
        list($hours, $minutes) = explode(':', $time);
        return $hours * 60 + $minutes;
    }

    /**
     * Paginate a collection
     * @param Collection $items
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    private function paginateCollection(Collection $items, int $perPage): LengthAwarePaginator
    {
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentItems = $items->slice(($currentPage - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator(
            $currentItems,
            $items->count(),
            $perPage,
            $currentPage,
            ['path' => LengthAwarePaginator::resolveCurrentPath()]
        );
    }
}
