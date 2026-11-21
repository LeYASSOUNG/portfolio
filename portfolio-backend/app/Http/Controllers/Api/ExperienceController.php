<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Cache::remember('experiences.all', 3600, function () {
            return Experience::orderBy('start_date', 'desc')->get();
        });
        return response()->json($experiences);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        $experience = Experience::create($validated);
        Cache::forget('experiences.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($experience, 201);
    }

    public function show(string $id)
    {
        $experience = Experience::findOrFail($id);
        return response()->json($experience);
    }

    public function update(Request $request, string $id)
    {
        $experience = Experience::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'company' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);

        $experience->update($validated);
        Cache::forget('experiences.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($experience);
    }

    public function destroy(string $id)
    {
        Experience::findOrFail($id)->delete();
        Cache::forget('experiences.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json(null, 204);
    }
}
