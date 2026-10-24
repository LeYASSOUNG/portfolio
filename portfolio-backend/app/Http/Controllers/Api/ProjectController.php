<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Cache::remember('projects.all', 3600, function () {
            return Project::latest()->get();
        });
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'link' => 'nullable|url',
            'github' => 'nullable|url',
        ]);

        $project = Project::create($validated);
        Cache::forget('projects.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($project, 201);
    }

    public function show(string $id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'image' => 'nullable|string',
            'link' => 'nullable|url',
            'github' => 'nullable|url',
        ]);

        $project->update($validated);
        Cache::forget('projects.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($project);
    }

    public function destroy(string $id)
    {
        Project::findOrFail($id)->delete();
        Cache::forget('projects.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json(null, 204);
    }
}
