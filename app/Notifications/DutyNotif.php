<?php

namespace App\Notifications;

use App\Helpers\DateTransformer;
use App\Models\Duty;
use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DutyNotif extends Notification
{
    use Queueable;

    private $duty;

    /**
     * Create a new notification instance.
     */
    public function __construct($duty)
    {
        $this->duty = $duty;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $createdAt = $this->duty->created_at ? Carbon::parse($this->duty->created_at) : null;
        $shamsiDate = (new Verta($createdAt))->format('Y/m/d');

        return [
            'title' => 'اعلان ثبت ماموریت',
            'notif' => $notifiable->fullname . ' در تاریخ ' . $shamsiDate . ' ماموریت ثبت کرد ',
            'more_data' => $this->duty,
            'type' => 'duty',
        ];
    }
}
