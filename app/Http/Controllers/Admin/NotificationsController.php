<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class NotificationsController extends Controller
{
    public function index(): Response
    {
        $notifications = DatabaseNotification::query()->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/NotificationList', [
            'notifications' => $notifications,
        ]);
    }

    public function readNotif(string $id): void
    {
        $notification = DatabaseNotification::query()->findOrFail($id);
        $notification->markAsRead();
    }
}
