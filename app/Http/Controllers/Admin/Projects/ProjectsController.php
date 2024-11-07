<?php

namespace App\Http\Controllers\Admin\Projects;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Projects\CreateProjectRequest;
use App\Http\Requests\Admin\Projects\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $projects = Project::query()->orderBy('created_at', 'DESC')->paginate(8);
        $projects_count = Project::query()->count();

        return Inertia::render('Admin/Projects/ProjectsList', [
            'projects' => $projects,
            'projects_count' => $projects_count
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Projects/CreateProject');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateProjectRequest $request): RedirectResponse
    {
        Project::query()->create([
            'title' => $request->title,
            'company_name' => $request->company_name
        ]);

        return redirect()->route('projects.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        $project = Project::query()->findOrFail($id);

        return Inertia::render('Admin/Projects/UpdateProject', [
            'project' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, string $id): RedirectResponse
    {
        $project = Project::query()->findOrFail($id);
        $project->update([
            'title' => $request->title,
            'company_name' => $request->company_name
        ]);

        return redirect()->route('projects.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): void
    {
        Project::destroy($id);
    }
}
