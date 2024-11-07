<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display index page of admin panel
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Admin');
    }
}
