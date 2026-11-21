<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Cache::remember('skills.all', 3600, function () {
            return Skill::all();
        });
        return response()->json($skills);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'level' => 'required|integer|min:0|max:100',
            'icon' => 'nullable|string',
        ]);

        $skill = Skill::create($validated);
        Cache::forget('skills.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($skill, 201);
    }

    public function show(string $id)
    {
        $skill = Skill::findOrFail($id);
        return response()->json($skill);
    }

    public function update(Request $request, string $id)
    {
        $skill = Skill::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'level' => 'sometimes|required|integer|min:0|max:100',
            'icon' => 'nullable|string',
        ]);

        $skill->update($validated);
        Cache::forget('skills.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json($skill);
    }

    public function destroy(string $id)
    {
        Skill::findOrFail($id)->delete();
        Cache::forget('skills.all');
        Cache::forget('chatbot.system_prompt.v2');
        return response()->json(null, 204);
    }
}
