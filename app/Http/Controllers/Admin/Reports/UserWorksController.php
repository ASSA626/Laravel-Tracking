<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Helpers\HoursToMin;
use App\Helpers\TimeDiff;
use App\Http\Controllers\Controller;
use App\Models\Clock;
use App\Models\Project;
use App\Models\User;
use App\Models\UserWorks;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserWorksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id): Response
    {
        $clock = Clock::query()->findOrFail($id);
        $user_works = UserWorks::query()->where('clock_id', $id)->get();
        $userworks_count = UserWorks::query()->where('clock_id', $id)->count();
        $projects = Project::query()->select('title')->get();

        return Inertia::render('Admin/Reports/UserWorksList', [
            'clock' => $clock,
            'user_works' => $user_works,
            'userworks_count' => $userworks_count,
            'projects' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $id): void
    {
        $time_value = HoursToMin::calculateTime($request->time_value);
        $clock = Clock::query()->findOrFail($id);
        $clock_time = HoursToMin::calculateTime(TimeDiff::timeDeferenceTwoTime($clock->start_time, $clock->left_time));
        $user_works = UserWorks::query()->where('clock_id', $clock->id)->get();
        $user_works_time = HoursToMin::sumTimes($user_works);

        $total_time = $clock_time - $user_works_time;

        if ($total_time < $time_value) {
            redirect()->back()->withErrors('میزان کارکرد بیشتر از کارکرد ثبت شده است');
        } else {
            UserWorks::query()->create([
                'user_id' => $clock->user->id,
                'clock_id' => $clock->id,
                'time_value' => $request->time_value,
                'project' => $request->project,
                'description' => $request->description,
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id, string $clock_id): void
    {
        $clock = Clock::query()->findOrFail($clock_id);
        $work = UserWorks::query()->findOrFail($id);
        $time_value = HoursToMin::calculateTime($request->time_value);
        $clock_time = HoursToMin::calculateTime(TimeDiff::timeDeferenceTwoTime($clock->start_time, $clock->left_time));
        $user_works = UserWorks::query()->where('clock_id', $clock->id)->get();
        $user_works_time = HoursToMin::sumTimes($user_works);
        $work_time = HoursToMin::calculateTime($work->time_value);

        $total_time = $clock_time - $user_works_time + $work_time;

        if ($total_time < $time_value) {
            redirect()->back()->withErrors('میزان کارکرد بیشتر از کارکرد ثبت شده است');
        } else {
            $work->update([
                'time_value' => $request->time_value,
                'project' => $request->project,
                'description' => $request->description,
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        UserWorks::destroy($id);
    }
}
