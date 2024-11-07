<?php

namespace App\Http\Requests\Admin\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
            'fullname' => 'required|unique:users',
            'username' => 'required|unique:users',
            'mobile' => 'required|unique:users',
            'national_code' => 'required|unique:users',
            'image' => 'nullable',
            'father_name' => 'required',
            'address' => 'required',
            'zip' => 'unique:users|nullable',
            'personally_number' => 'unique:users|nullable',
            'bimeh_number' => 'unique:users|nullable',
            'home_phone' => 'unique:users|nullable',
            'mobile_friend' => 'required|unique:users',
            'user_activity' => 'required',
            'days_function' => 'required',
            'bimeh' => 'required',
            'password' => 'required',
        ];
    }
}
