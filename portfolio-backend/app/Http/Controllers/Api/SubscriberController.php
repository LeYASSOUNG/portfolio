<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email'
        ]);

        Subscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['status' => 'active']
        );

        return response()->json(['status' => 'success']);
    }

    public function index()
    {
        return response()->json(Subscriber::orderBy('created_at', 'desc')->get());
    }

    public function destroy(int $id)
    {
        $subscriber = Subscriber::findOrFail($id);
        $subscriber->delete();
        return response()->json(['status' => 'deleted']);
    }

    public function sendNewsletter(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'body' => 'required|string'
        ]);

        $subscribers = Subscriber::where('status', 'active')->get();

        // Pour la démonstration, on simule l'envoi. Dans la vraie vie, on utiliserait Mail::to($subscriber->email)->queue(...)
        foreach ($subscribers as $subscriber) {
            // \Illuminate\Support\Facades\Mail::to($subscriber->email)->send(new \App\Mail\NewsletterMail($request->subject, $request->body));
        }

        return response()->json(['message' => 'Newsletter envoyée à ' . $subscribers->count() . ' abonnés']);
    }
}
