<?php

namespace App\Http\Controllers\Admin\Duties;

use App\Helpers\DateTransformer;
use App\Http\Controllers\Controller;
use App\Models\Duty;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DutiesController extends Controller
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

        $query = Duty::query();

        if ($user) {
            $query->where('user_id', $user);
        }

        $duties = $query
                ->with('user')
                ->when($of_date && $to_date, function ($query) use ($of_date, $to_date) {
                    $query->whereBetween('created_at', [$of_date, $to_date]);
                })
                ->orderBy('created_at', 'DESC')
                ->paginate(8);

        $duties_count = $query->count();

        return Inertia::render('Admin/Duties/DutiesList', [
            'duties' => $duties,
            'duties_count' => $duties_count,
            'users' => $users
        ]);
    }

    /**
     * Change record status
     */
    public function changeStatus(Request $request, string $id): RedirectResponse
    {
        $duty = Duty::query()->findOrFail($id);

        $duty->update(['status' => $request->status]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        Duty::destroy($id);
    }
}
