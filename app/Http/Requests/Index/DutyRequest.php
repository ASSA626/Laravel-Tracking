<?php

namespace App\Http\Requests\Index;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DutyRequest extends FormRequest
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
            'date_of_request' => 'required',
            'of_date' => 'required',
            'to_date' => 'required',
            'project' => 'required',
            'place' => 'required',
            'transporter' => 'required',
        ];
    }
}