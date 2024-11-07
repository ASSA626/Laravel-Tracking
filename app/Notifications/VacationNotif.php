<?php

namespace App\Notifications;

use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VacationNotif extends Notification
{
    use Queueable;

    private $vacation;

    /**
     * Create a new notification instance.
     */
    public function __construct($vacation)
    {
        $this->vacation = $vacation;
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
        $createdAt = $this->vacation->created_at ? Carbon::parse($this->vacation->created_at) : null;
        $shamsiDate = (new Verta($createdAt))->format('Y/m/d');

        return [
            'title' => 'اعلان ثبت مرخصی',
            'notif' => $notifiable->fullname . ' در تاریخ ' . $shamsiDate . ' مرخصی ثبت کرد ',
            'more_data' => $this->vacation,
            'type' => 'vacation',
        ];
    }
}
