<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GuestbookEntry;
use Illuminate\Support\Facades\Auth;

class GuestbookController extends Controller
{
    public function index()
    {
        $entries = GuestbookEntry::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $user = Auth::user();

        $entry = GuestbookEntry::create([
            'user_name' => $user->name,
            'user_avatar' => $user->avatar,
            'provider' => 'github',
            'provider_id' => $user->github_id,
            'message' => $request->message,
            'is_approved' => true // Or false if you want admin moderation
        ]);

        return response()->json($entry, 201);
    }
}
