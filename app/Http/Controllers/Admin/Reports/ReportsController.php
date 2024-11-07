<?php

namespace App\Http\Controllers\Admin\Reports;

use App\Helpers\ClockTransformer;
use App\Helpers\DateTransformer;
use App\Helpers\Services\JalaliReportUser;
use App\Helpers\Services\ReportsUser;
use App\Helpers\TimeDiff;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Clock\CreateClockRequest;
use App\Http\Requests\Admin\Clock\UpdateClockRequest;
use App\Http\Requests\Admin\DutyClock\CreateDutyClockRequest;
use App\Http\Requests\Admin\DutyClock\UpdateDutyClockRequest;
use App\Http\Requests\Admin\WorkArHome\CreateWorkAtHomeRequest;
use App\Http\Requests\Admin\WorkArHome\UpdateWorkAtHomeRequest;
use App\Models\Clock;
use App\Models\Duty;
use App\Models\DutyClock;
use App\Models\Project;
use App\Models\User;
use App\Models\UserWorkHome;
use App\Models\UserWorks;
use App\Models\WorkAtHome;
use Exception;
use Hekmatinasser\Verta\Verta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\PdfBuilder;
use function Spatie\LaravelPdf\Support\pdf;

class ReportsController extends Controller
{
    /**
     * return empty array for create null array in inertia
     * @return array[]
     */
    private function emptyPagination(): array
    {
        return [
            'data' => [],
        ];
    }

    /**
     * Display a listing of the resource.
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $user_id = $request->user_id;
        $users = User::query()->where('role', 'user')->orderBy('created_at', 'DESC')->get();

        if ($user_id) {
            if ($request->query('of_date') || $request->query('to_date')) {
                $start_date = DateTransformer::shamsi_to_miladi($request->query('of_date'));
                $end_date = DateTransformer::shamsi_to_miladi($request->query('to_date'));
            } else {
                $start_date = null;
                $end_date = null;
            }

            $projects = Project::query()->get();
            $user = User::query()->findOrFail($user_id);
            $duties = Duty::query()->where('user_id', $user_id)->get();

            $clocks = Clock::query()->with(['user', 'work'])->where('user_id', $user_id)->orderBy('date', 'ASC')->paginate(8);
            $clocks_count = Clock::query()->where('user_id', $user_id)->count();

            $homeworks = WorkAtHome::query()->with(['user', 'homework'])->where('user_id', $user_id)->orderBy('date', 'ASC')->paginate(8);
            $homeworks_count = WorkAtHome::query()->where('user_id', $user_id)->count();

            $duties_clocks = DutyClock::query()->with('user')->where('user_id', $user_id)->orderBy('date', 'ASC')->paginate(8);
            $duties_clocks_count = DutyClock::query()->where('user_id', $user_id)->count();

            $new_report = new ReportsUser($user_id);
            $reports = $new_report->reports($start_date, $end_date);

            return Inertia::render('Admin/Reports/ReportsList', [
                'users' => $users,
                'clocks' => $clocks,
                'clocks_count' => $clocks_count,
                'homeworks' => $homeworks,
                'homeworks_count' => $homeworks_count,
                'errorMessage' => null,
                'projects' => $projects,
                'reports' => $reports,
                'username' => $user->fullname,
                'duties_clocks' => $duties_clocks,
                'duties_clocks_count' => $duties_clocks_count,
                'duties' => $duties,
                'user_id' => $user_id
            ]);
        } else {
            return Inertia::render('Admin/Reports/ReportsList', [
                'users' => $users,
                'clocks' => $this->emptyPagination(),
                'clocks_count' => 0,
                'homeworks' => $this->emptyPagination(),
                'homeworks_count' => 0,
                'errorMessage' => 'کاربری برای نمایش اطلاعات انتخاب نشده',
                'projects' => [],
                'reports' => [],
                'username' => "",
                'duties_clocks' => $this->emptyPagination(),
                'duties_clocks_count' => 0,
                'duties' => [],
                'user_id' => null
            ]);
        }
    }

    /**
     * Update users clocks from clocks table
     * @param UpdateClockRequest $request
     * @param string $id
     * @return void
     */
    public function updateClock(UpdateClockRequest $request, string $id): void
    {
        $clock = Clock::query()->findOrFail($id);
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        $start_time = ClockTransformer::shamsi_to_UTC($request->start_time);
        $left_time = ClockTransformer::shamsi_to_UTC($request->left_time);

        $clock->update([
            'start_time' => $start_time,
            'user_work' => true,
            'left_time' => $left_time,
            'daily_time' => $totalTime,
        ]);
    }

    /**
     * Update users home clocks from workathome table
     * @param UpdateWorkAtHomeRequest $request
     * @param string $id
     * @return void
     */
    public function updateHomework(UpdateWorkAtHomeRequest $request, string $id): void
    {
        $homework = WorkAtHome::query()->findOrFail($id);
        $user_home_work = UserWorkHome::query()->where('work_at_home_id', $id)->first();
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        $start_time = ClockTransformer::shamsi_to_UTC($request->start_time);
        $left_time = ClockTransformer::shamsi_to_UTC($request->left_time);

        $homework->update([
            'start_time' => $start_time,
            'user_work_home' => true,
            'left_time' => $left_time,
            'daily_time' => $totalTime,
            'status' => 'confirming'
        ]);

        if ($user_home_work) {
            $user_home_work->update([
                'project' => $request->project,
                'time_value' => $totalTime
            ]);
        } else {
            UserWorkHome::query()->create([
                'user_id' => $homework->user_id,
                'work_at_home_id' => $id,
                'project' => $request->project,
                'time_value' => $totalTime
            ]);
        }
    }

    /**
     * Update users duty clocks from dutyclocks table
     * @param UpdateDutyClockRequest $request
     * @param string $id
     * @return void
     */
    public function updateDutyClock(Request $request, string $id): void
    {
        $duty_clock = DutyClock::query()->findOrFail($id);
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        $start_time = ClockTransformer::shamsi_to_UTC($request->start_time);
        $left_time = ClockTransformer::shamsi_to_UTC($request->left_time);

        $duty_clock->update([
            'duty_id' => $request->duty,
            'start_time' => $start_time,
            'left_time' => $left_time,
            'daily_time' => $totalTime,
            'status' => 'confirming'
        ]);
    }

    /**
     * Delete users clocks from clocks table
     * @param string $id
     * @return void
     */
    public function destroyClock(string $id): void
    {
        Clock::destroy($id);
    }

    /**
     * Delete users work at home clocks from workathome table
     * @param string $id
     * @return void
     */
    public function destroyHomework(string $id): void
    {
        WorkAtHome::destroy($id);
    }

    /**
     * Delete users work at duty clocks from workathome table
     * @param string $id
     * @return void
     */
    public function destroyDutyClock(string $id): void
    {
        DutyClock::destroy($id);
    }

    /**
     * Change user workathome status
     * @param Request $request
     * @param string $id
     * @return RedirectResponse
     */
    public function changeWorkAtHomeStatus(Request $request, string $id): RedirectResponse
    {
        $workathome = WorkAtHome::query()->findOrFail($id);

        $workathome->update(['status' => $request->status]);

        return redirect()->back();
    }

    /**
     * Change user dutyClock status
     * @param Request $request
     * @param string $id
     * @return RedirectResponse
     */
    public function changeDutyClockStatus(Request $request, string $id): RedirectResponse
    {
        $duty_clock = DutyClock::query()->findOrFail($id);

        $duty_clock->update(['status' => $request->status]);

        return redirect()->back();
    }

    /**
     * Get PDF report from user clocks of duties & workathome and clock table
     * @param Request $request
     * @param string $user_id
     * @return PdfBuilder
     * @throws Exception
     */
    public function getReport(Request $request, string $user_id): PdfBuilder
    {
        $user = User::query()->findOrFail($user_id);

        if ($request->query('of_date') || $request->query('to_date')) {
            $start_date = DateTransformer::shamsi_to_miladi($request->query('of_date'));
            $end_date = DateTransformer::shamsi_to_miladi($request->query('to_date'));
        } else {
            $start_date = null;
            $end_date = null;
        }

        $generatedAt = Verta::now()->format('%B %d، %Y');

        $new_report = new JalaliReportUser($user_id);
        $reports = $new_report->getMonthlyReport($start_date, $end_date);

        $name = Str::random('10') . '.pdf';
        return pdf()->view('pdf.report', ['reports' => $reports['reports'], 'works' => $reports['works'], 'total_time' => $reports['totalTime'], 'total_day' => $reports['totalDay'], 'user' => $user, 'generated_at' => $generatedAt])
            ->withBrowsershot(function (Browsershot $browsershot) {
                $browsershot->noSandbox();
                $browsershot->setChromePath(env('CHROMIUM_LINK'));
            })
            ->format(Format::A4)
            ->name($name)
            ->download();
    }

    /**
     * Create clock for users
     * @param CreateClockRequest $request
     * @param string $user_id
     * @return void
     */
    public function createClock(CreateClockRequest $request, string $user_id): void
    {
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        $start_time = ClockTransformer::shamsi_to_UTC($request->start_time);
        $left_time = ClockTransformer::shamsi_to_UTC($request->left_time);

        $new_clock = Clock::query()->create([
            'date' => DateTransformer::shamsi_to_miladi($request->created_at),
            'user_id' => $user_id,
            'start_time' => $start_time,
            'user_work' => true,
            'daily_time' => $totalTime,
            'left_time' => $left_time,
        ]);

        if ($request->time_entries) {
            foreach ($request->time_entries as $entry) {
                UserWorks::query()->create([
                    'user_id' => $user_id,
                    'clock_id' => $new_clock->id,
                    'time_value' => $entry['time_value'], // دسترسی به time_value
                    'project' => $entry['project'] // دسترسی به project
                ]);
            }
        }
    }

    /**
     * Create workathome clocks for users
     * @param CreateWorkAtHomeRequest $request
     * @param string $user_id
     * @return void
     */
    public function createWorkAtHome(CreateWorkAtHomeRequest $request, string $user_id): void
    {
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        $start_time = ClockTransformer::shamsi_to_UTC($request->start_time);
        $left_time = ClockTransformer::shamsi_to_UTC($request->left_time);

        $new_workathome = WorkAtHome::query()->create([
            'date' => DateTransformer::shamsi_to_miladi($request->created_at),
            'user_id' => $user_id,
            'start_time' => $start_time,
            'user_work_home' => true,
            'daily_time' => $totalTime,
            'left_time' => $left_time,
            'status' => 'confirmed'
        ]);

        UserWorkHome::query()->create([
            'user_id' => $user_id,
            'work_at_home_id' => $new_workathome->id,
            'time_value' => $request->time_value,
            'project' => $request->project
        ]);
    }

    /**
     * Create duty clocks for users
     * @param CreateDutyClockRequest $request
     * @param string $user_id
     * @return void
     */
    public function createDutyClock(CreateDutyClockRequest $request, string $user_id): void
    {
        $totalTime = TimeDiff::timeDeferenceTwoTime($request->start_time, $request->left_time);

        DutyClock::query()->create([
            'date' => DateTransformer::shamsi_to_miladi($request->created_at),
            'user_id' => $user_id,
            'duty_id' => $request->duty_id,
            'start_time' => $request->start_time,
            'daily_time' => $totalTime,
            'left_time' => $request->left_time,
            'status' => 'confirmed'
        ]);
    }

    public function getUserWorks(string $id)
    {
        return UserWorks::query()->where("clock_id", $id)->get();
    }
}
