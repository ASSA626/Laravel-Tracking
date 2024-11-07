<?php

namespace App\Notifications;

use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SalaryNotif extends Notification
{
    use Queueable;

    private $salary;

    /**
     * Create a new notification instance.
     */
    public function __construct($salary)
    {
        $this->salary = $salary;
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
        $createdAt = $this->salary->created_at ? Carbon::parse($this->salary->created_at) : null;
        $shamsiDate = (new Verta($createdAt))->format('Y/m/d');

        return [
            'title' => 'اعلان ثبت تنخواه',
            'notif' => $notifiable->fullname . ' در تاریخ ' . $shamsiDate . ' تنخواه ' . $this->salary->value . ' تومان ثبت کرد ',
            'more_data' => $this->salary,
            'type' => 'salary',
        ];
    }
}
