<?php

namespace App\Http\Requests\Admin\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'fullname' => 'required|unique:users,fullname,' . $this->user,
            'username' => 'required|unique:users,username,' . $this->user,
            'mobile' => 'required|unique:users,mobile,' . $this->user,
            'national_code' => 'required|unique:users,national_code,' . $this->user,
            'image' => 'nullable',
            'father_name' => 'required',
            'address' => 'required',
            'zip' => 'nullable|unique:users,zip,' . $this->user,
            'personally_number' => 'nullable|unique:users,personally_number,' . $this->user,
            'bimeh_number' => 'nullable|unique:users,bimeh_number,' . $this->user,
            'home_phone' => 'nullable|unique:users,home_phone,' . $this->user,
            'mobile_friend' => 'required|unique:users,mobile_friend,' . $this->user,
            'user_activity' => 'required',
            'days_function' => 'required',
            'bimeh' => 'required',
        ];
    }
}
