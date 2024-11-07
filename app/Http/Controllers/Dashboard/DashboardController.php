<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\ClockTransformer;
use App\Helpers\DateTransformer;
use App\Helpers\HoursToMin;
use App\Helpers\TimeDiff;
use App\Http\Controllers\Controller;
use App\Http\Requests\Index\DutyRequest;
use App\Http\Requests\Index\SalaryRequest;
use App\Http\Requests\Index\UserWorkRequest;
use App\Http\Requests\Index\VacationRequest;
use App\Models\Clock;
use App\Models\Duty;
use App\Models\DutyClock;
use App\Models\Project;
use App\Models\Salary;
use App\Models\UserWorkHome;
use App\Models\UserWorks;
use App\Models\Vacation;
use App\Models\WorkAtHome;
use App\Notifications\DutyNotif;
use App\Notifications\SalaryNotif;
use App\Notifications\VacationNotif;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * @return Response
     */
    public function index(): Response
    {
        $user = Auth::id();
        $totalTime = 0;
        $total_min = 0;
        $totalTimeHome = "";

        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $homework = WorkAtHome::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $duties_clock = DutyClock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $projects = Project::query()->select('title')->get();
        $duties = Duty::query()->where('user_id', $user)->get();

        if ($clock) {
            if ($clock->start_time) {
                $totalTime = TimeDiff::timeDeference($clock->start_time);
                $total_min = HoursToMin::calculateTime($totalTime);
            }
        }
        if ($clock) {
            $user_works = UserWorks::query()->where('clock_id', $clock->id)->get();
            $user_works_time = HoursToMin::sumTimes($user_works);
            $totalTime = $total_min - $user_works_time;
            $totalTime = HoursToMin::calculateHours($totalTime);
        }
        if ($homework) {
            if ($homework->start_time) {
                $totalTimeHome = TimeDiff::timeDeference($homework->start_time);
            }
        }

        return Inertia::render('Dashboard/Dashboard', [
            'clock' => $clock,
            'home_work' => $homework,
            'total_time' => $totalTime,
            'total_time_home' => $totalTimeHome,
            'projects' => $projects,
            'mission_time' => $duties_clock,
            'duties' => $duties
        ]);
    }

    /**
     * store user start time
     * @return void
     */
    public function storeStartTime(): void
    {
        $user = Auth::id();
        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $homework = WorkAtHome::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $duty_clock = DutyClock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $currentTime = Carbon::now()->format('H:i');

        if ($clock) {
            redirect()->route('dashboard')->withErrors('ساعت خروج شما ثبت شده');
        } else {
            if ($homework) {
                redirect()->route('dashboard')->withErrors('ساعت خروج کار در منزل ثبت نشده');
            } else {
                if ($duty_clock) {
                    redirect()->route('dashboard')->withErrors('ساعت خروج ماموریت ثبت نشده');
                } else {
                    Clock::query()->create([
                        'user_id' => $user,
                        'start_time' => $currentTime,
                        'date' => now()->format('Y-m-d')
                    ]);
                }
            }
        }
    }

    /**
     * store user works for today
     * @param UserWorkRequest $request
     * @return void
     */
    public function storeUserWork(UserWorkRequest $request): void
    {
        $user = Auth::id();
        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $totalTime = TimeDiff::timeDeference($clock->start_time);
        $total_min = HoursToMin::calculateTime($totalTime);

        $user_works = UserWorks::query()->where('clock_id', $clock->id)->get();

        $user_works_time = HoursToMin::sumTimes($user_works);
        $totalTime = $total_min - $user_works_time;
        $user_time = HoursToMin::calculateTime($request->time_value);

        if (!$clock) {
            request()->flash('message', 'ساعت ورود یافت نشد');
        } else {
            if ($user_time > $totalTime) {
                redirect()->back()->withErrors(['message' => 'میزان کارکرد شما بیشتر از میزان واقعی است.']);
            } else {
                UserWorks::query()->create([
                    'user_id' => $user,
                    'clock_id' => $clock->id,
                    'time_value' => $request->time_value,
                    'project' => $request->project,
                    'description' => $request->description
                ]);
            }
        }
    }

    /**
     * store user left time for today
     * @return void
     */
    public function storeLeftTime(): void
    {
        $user = Auth::id();
        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $endTime = Carbon::now()->format('H:i');
        $totalTime = TimeDiff::timeDeference($clock->start_time);

        if (!$clock) {
            request()->flash('message', 'ساعت ورود یافت نشد');
        } else {
            $clock->update([
                'left_time' => $endTime,
                'user_work' => true,
                'daily_time' => $totalTime
            ]);
        }
    }

    /**
     * store user salaries
     * @param SalaryRequest $request
     * @return void
     */
    public function storeUserSalary(SalaryRequest $request): void
    {
        $user = Auth::user();

        $salary = Salary::query()->create([
            'user_id' => $user->id,
            'title' => $request->title,
            'value' => $request->value,
            'count' => $request->count,
            'complete_value' => $request->complete_value,
            'description' => $request->description,
        ]);

        $user->notify(new SalaryNotif($salary));
    }

    /**
     * store user vacation
     * @param VacationRequest $request
     * @return void
     */
    public function storeUserVacation(VacationRequest $request): void
    {
        $user = Auth::user();

        $type = $request->type;
        $of_time = $request->of_time;
        $to_time = $request->to_time;

        if ($type === 'ساعتی') {
            $start_utc = ClockTransformer::shamsi_to_UTC($of_time);
            $end_utc = ClockTransformer::shamsi_to_UTC($to_time);

            $vacation = Vacation::query()->create([
                'user_id' => $user->id,
                'date_of_request' => $request->date_of_request,
                'of_time' => $start_utc,
                'to_time' => $end_utc,
                'type' => $type,
                'caption' => $request->caption,
            ]);
        } else {
            $miladi_start = DateTransformer::shamsi_to_miladi($of_time);
            $miladi_end = DateTransformer::shamsi_to_miladi($to_time);

            $vacation = Vacation::query()->create([
                'user_id' => $user->id,
                'date_of_request' => $request->date_of_request,
                'of_time' => $miladi_start,
                'to_time' => $miladi_end,
                'type' => $type,
                'caption' => $request->caption,
            ]);
        }

        $user->notify(new VacationNotif($vacation));
    }

    /**
     * store user duty (missions)
     * @param DutyRequest $request
     * @return void
     */
    public function storeUserDuty(DutyRequest $request): void
    {
        $user = Auth::user();

        $date_of_request = DateTransformer::shamsi_to_miladi($request->date_of_request);
        $of_date = DateTransformer::shamsi_to_miladi($request->of_date);
        $to_date = DateTransformer::shamsi_to_miladi($request->to_date);

        $duty = Duty::query()->create([
            'user_id' => $user->id,
            'date_of_request' => $date_of_request,
            'of_date' => $of_date,
            'to_date' => $to_date,
            'project' => $request->project,
            'place' => $request->place,
            'transporter' => $request->transporter,
            'description' => $request->description,
        ]);

        $user->notify(new DutyNotif($duty));
    }

    /**
     * store start time user work that for home
     * @return void
     */
    public function storeUserHomeWork(): void
    {
        $user = Auth::id();
        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $homework = WorkAtHome::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $duty_clock = DutyClock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $currentTime = Carbon::now()->format('H:i');

        if ($homework) {
            redirect()->route('dashboard')->withErrors('ساعت خروج شما ثبت شده');
        } else {
            if ($clock) {
                redirect()->route('dashboard')->withErrors('ساعت خروج شما ثبت نشده');
            } else {
                if ($duty_clock) {
                    redirect()->route('dashboard')->withErrors('ساعت خروج ماموریت شما ثبت نشده');
                } else {
                    WorkAtHome::query()->create([
                        'user_id' => $user,
                        'start_time' => $currentTime,
                        'date' => now()->format('Y-m-d')
                    ]);
                }
            }
        }
    }

    /**
     * store left time and works user that for home
     * @param Request $request
     * @return void
     */
    public function storeUserWorkAtHome(Request $request): void
    {
        $user = Auth::id();
        $homework = WorkAtHome::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $endTime = Carbon::now()->format('H:i');
        $totalTime = TimeDiff::timeDeference($homework->start_time);

        if (!$homework) {
            redirect()->back()->withErrors('ساعت ورود یافت نشد');
        } else {
            if ($request->time_value > $totalTime) {
                redirect()->back()->withErrors('میزان ساعت وارد شده بیشتر از میزان واقعی است.');
            } else {
                UserWorkHome::query()->create([
                    'user_id' => $user,
                    'work_at_home_id' => $homework->id,
                    'time_value' => $request->time_value,
                    'project' => $request->project,
                    'description' => $request->description
                ]);

                $homework->update([
                    'left_time' => $endTime,
                    'user_work_home' => true,
                    'daily_time' => $totalTime
                ]);
            }
        }
    }

    /**
     * store user duties time
     * @param Request $request
     * @return void
     */
    public function storeUserMissionClock(Request $request): void
    {
        $user = Auth::id();
        $clock = Clock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $duty_clock = DutyClock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $duty_requested = Duty::query()->findOrFail($request->duty);
        $homework = WorkAtHome::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $currentTime = Carbon::now()->format('H:i');

        if ($duty_clock) {
            redirect()->route('dashboard')->withErrors('ساعت خروج شما ثبت شده');
        } else {
            if ($homework) {
                redirect()->route('dashboard')->withErrors('ساعت خروج کار در منزل ثبت نشده');
            } else {
                if ($clock) {
                    redirect()->route('dashboard')->withErrors('ساعت خروج ثبت نشده');
                } else {
                    if ($duty_requested->status === 'confirmed') {
                        DutyClock::query()->create([
                            'user_id' => $user,
                            'duty_id' => $request->duty,
                            'start_time' => $currentTime,
                            'date' => now()->format('Y-m-d')
                        ]);
                    } else {
                        redirect()->route('dashboard')->withErrors('ماموریت شما تایید نشده');
                    }
                }
            }
        }
    }

    /**
     * store user duties left time
     * @return void
     */
    public function storeUserLeftMissionClock(): void
    {
        $user = Auth::id();
        $duty_clock = DutyClock::query()->where('user_id', $user)->whereNull('left_time')->latest()->first();
        $endTime = Carbon::now()->format('H:i');
        $totalTime = TimeDiff::timeDeference($duty_clock->start_time);

        if (!$duty_clock) {
            redirect()->route('dashboard')->withErrors('ساعت ورود یافت نشد');
        } else {
            $duty_clock->update([
                'left_time' => $endTime,
                'daily_time' => $totalTime
            ]);
        }
    }
}
