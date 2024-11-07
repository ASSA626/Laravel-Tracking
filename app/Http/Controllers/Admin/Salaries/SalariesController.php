<?php

namespace App\Http\Controllers\Admin\Salaries;

use App\Helpers\DateTransformer;
use App\Http\Controllers\Controller;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalariesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user_id;
        $users = User::query()->where('role', 'user')->orderBy('created_at', 'DESC')->get();

        if ($request->query('of_date') || $request->query('to_date')) {
            $of_date = DateTransformer::shamsi_to_miladi($request->query('of_date'));
            $to_date = DateTransformer::shamsi_to_miladi($request->query('to_date'));
        } else {
            $of_date = null;
            $to_date = null;
        }

        $query = Salary::query();

        if ($user) {
            $query->where('user_id', $user);
        }

        $salaries = $query
                ->with('user')
                ->when($of_date && $to_date, function ($query) use ($of_date, $to_date) {
                    $query->whereBetween('created_at', [$of_date, $to_date]);
                })
                ->orderBy('created_at', 'DESC')
                ->paginate(8);
        $salaries_count = $query->count();

        return Inertia::render('Admin/Salaries/SalariesList', [
            'salaries' => $salaries,
            'salaries_count' => $salaries_count,
            'users' => $users
        ]);
    }

    public function changeStatus(Request $request, string $id): RedirectResponse
    {
        $salary = Salary::query()->findOrFail($id);

        $salary->update(['status' => $request->status]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        Salary::destroy($id);
    }
}
