<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function index()
    {
        // Retourne le top 10 des meilleurs temps
        return response()->json(
            Score::orderBy('time_taken', 'asc')->limit(10)->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'player_name' => 'required|string|max:50',
            'score' => 'required|integer|min:0|max:100',        // nombre de mots trouvés
            'time_taken' => 'required|integer|min:1|max:86400', // en secondes
        ]);

        $score = Score::create($validated);
        return response()->json($score, 201);
    }

    public function destroy(int $id)
    {
        Score::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
