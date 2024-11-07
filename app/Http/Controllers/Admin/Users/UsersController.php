<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Users\CreateUserRequest;
use App\Http\Requests\Admin\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $users = User::query()->orderBy('created_at', 'DESC')->paginate(8);
        $users_count = User::query()->count();

        return Inertia::render('Admin/Users/UsersList', [
            'users' => $users,
            'users_count' => $users_count
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/CreateUser');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateUserRequest $request): RedirectResponse
    {
        User::query()->create([
            'fullname' => $request->fullname,
            'username' => $request->username,
            'mobile' => $request->mobile,
            'national_code' => $request->national_code,
            'image' => 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png',
            'father_name' => $request->father_name,
            'address' => $request->address,
            'zip' => $request->zip,
            'personally_number' => $request->personally_number,
            'bimeh_number' => $request->bimeh_number,
            'home_phone' => $request->home_phone,
            'mobile_friend' => $request->mobile_friend,
            'user_activity' => $request->user_activity,
            'days_function' => $request->days_function,
            'bimeh' => $request->bimeh,
            'password' => Hash::make($request->password)
        ]);

        return redirect()->route('users.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $user = User::query()->findOrFail($id);

        return Inertia::render('Admin/Users/UpdateUser', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id): RedirectResponse
    {
        $user = User::query()->findOrFail($id);

        $user->update([
            'fullname' => $request->fullname,
            'username' => $request->username,
            'mobile' => $request->mobile,
            'national_code' => $request->national_code,
            'image' => 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png',
            'father_name' => $request->father_name,
            'address' => $request->address,
            'zip' => $request->zip,
            'personally_number' => $request->personally_number,
            'bimeh_number' => $request->bimeh_number,
            'home_phone' => $request->home_phone,
            'mobile_friend' => $request->mobile_friend,
            'user_activity' => $request->user_activity,
            'days_function' => $request->days_function,
            'bimeh' => $request->bimeh,
        ]);

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        User::destroy($id);
    }
}
