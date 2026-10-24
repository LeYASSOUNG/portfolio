<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Visit;

class StatsController extends Controller
{
    public function getStats()
    {
        return response()->json([
            'projects' => Project::count(),
            'skills' => Skill::count(),
            'experiences' => Experience::count(),
            'messages' => Message::count(),
            'visits' => Visit::count(),
        ]);
    }

    public function recordVisit(Request $request)
    {
        Visit::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'page' => $request->input('page', '/'),
        ]);
        return response()->json(['message' => 'Visit recorded']);
    }
}
