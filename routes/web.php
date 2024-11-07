<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Users\UsersController;
use App\Http\Controllers\Admin\Duties\DutiesController;
use App\Http\Controllers\Admin\Salaries\SalariesController;
use App\Http\Controllers\Admin\Projects\ProjectsController;
use App\Http\Controllers\Admin\Reports\ReportsController;
use App\Http\Controllers\Admin\Reports\UserWorksController;
use App\Http\Controllers\Admin\Vacations\VacationsController;
use App\Http\Controllers\Admin\NotificationsController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->name('login.store');
});

Route::middleware(['auth'])->group(function () {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
});

Route::middleware(['auth', 'user'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('start-time', [DashboardController::class, 'storeStartTime'])->name('start.time');
    Route::post('user-work-store', [DashboardController::class, 'storeUserWork'])->name('user-work.store');
    Route::post('left-time', [DashboardController::class, 'storeLeftTime'])->name('left.time');
    Route::post('salary', [DashboardController::class, 'storeUserSalary'])->name('salary.store');
    Route::post('vacation', [DashboardController::class, 'storeUserVacation'])->name('vacation.store');
    Route::post('duty', [DashboardController::class, 'storeUserDuty'])->name('duty.store');
    Route::post('home-start-time', [DashboardController::class, 'storeUserHomeWork'])->name('start-home.time');
    Route::post('user-home-work', [DashboardController::class, 'storeUserWorkAtHome'])->name('user-home-work.store');
    Route::post('user-clocks-mission', [DashboardController::class, 'storeUserMissionClock'])->name('user-clocks-mission.store');
    Route::post('user-clocks-mission-left', [DashboardController::class, 'storeUserLeftMissionClock'])->name('user-clocks-mission-left.store');
});

Route::middleware(['auth', 'admin'])->prefix('/admin')->group(function () {
    // * Admin dashboard get route
    Route::get('/', [AdminController::class, 'index'])->name('admin');

    // * Admin notifications routes
    Route::get('/notifications', [NotificationsController::class, 'index'])->name('notifications');
    Route::post('/notification/read/{id}', [NotificationsController::class, 'readNotif'])->name('notification.read');

    // * Projects resource route
    Route::resource('/projects', ProjectsController::class);

    // * Users resource route
    Route::resource('/users', UsersController::class);

    // * Duties resource route and change status POST route
    Route::resource('/duties', DutiesController::class);
    Route::post('/change-duty-status/{id}', [DutiesController::class, 'changeStatus'])->name('change.duty.status');

    // * Salaries resource route
    Route::resource('/salaries', SalariesController::class);
    Route::post('/change-salary-status/{id}', [SalariesController::class, 'changeStatus'])->name('change.salary.status');

    // * Projects resource route
    Route::resource('/vacations', VacationsController::class);
    Route::post('/change-vacation-status/{id}', [VacationsController::class, 'changeStatus'])->name('change.vacation.status');

    // * Report resource route
    Route::resource('/reports', ReportsController::class);
    Route::put('/reports/update-clock/{id}', [ReportsController::class, 'updateClock'])->name('reports.update-clock');
    Route::put('/reports/update-homework/{id}', [ReportsController::class, 'updateHomework'])->name('reports.update-homework');
    Route::put('/reports/update-duty-clock/{id}', [ReportsController::class, 'updateDutyClock'])->name('reports.update-duty-clock');
    Route::delete('/reports/delete-clock/{id}', [ReportsController::class, 'destroyClock'])->name('reports.delete-clock');
    Route::delete('/reports/delete-homework/{id}', [ReportsController::class, 'destroyHomework'])->name('reports.delete-homework');
    Route::delete('/reports/delete-duty/{id}', [ReportsController::class, 'destroyDutyClock'])->name('reports.delete-duty');
    Route::post('/report-change-workathome-status/{id}', [ReportsController::class, 'changeWorkAtHomeStatus'])->name('change.workathome.status');
    Route::post('/report-change-duty-clock-status/{id}', [ReportsController::class, 'changeDutyClockStatus'])->name('change.dutyclock.status');
    Route::get('/report-get-pdf/{id}', [ReportsController::class, 'getReport'])->name('get.report.pdf');
    Route::post("/report-create-clock/{id}", [ReportsController::class, 'createClock'])->name("report.crate.clock");
    Route::post("/report-create-workathome-clock/{id}", [ReportsController::class, 'createWorkAtHome'])->name("report.crate.workathome");
    Route::post("/report-create-dutyclock/{id}", [ReportsController::class, 'createDutyClock'])->name("report.crate.dutyclock");

    // * User works routes
    Route::get('/user-works/{id}', [UserWorksController::class, "index"])->name('userworks.index');
    Route::post('/create-user-works/{id}', [UserWorksController::class, "store"])->name('userworks.create');
    Route::put('/update-user-works/{id}/{clock_id}', [UserWorksController::class, "update"])->name('userworks.update');
    Route::delete('/delete-user-works/{id}', [UserWorksController::class, "destroy"])->name('userworks.delete');
});
