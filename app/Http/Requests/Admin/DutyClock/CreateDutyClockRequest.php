<?php

namespace App\Http\Requests\Admin\DutyClock;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateDutyClockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'created_at' => 'required',
            'duty_id' => 'required',
            'start_time' => 'required',
            'left_time' => 'required',
        ];
    }
}
