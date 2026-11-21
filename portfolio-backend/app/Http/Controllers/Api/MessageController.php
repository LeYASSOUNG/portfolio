<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessageReceived;

class MessageController extends Controller
{
    public function index()
    {
        // On renvoie les messages (potentiellement protéger cette route)
        return response()->json(Message::latest()->get());
    }
    public function store(Request $request)
    {
        // Protection Honeypot : les robots remplissent souvent tous les champs cachés
        if (!empty($request->input('_gotcha')) || !empty($request->input('website'))) {
            // Rejet silencieux : on fait croire au bot que le message est parti sans polluer la BDD ni envoyer d'email
            return response()->json(['success' => true, 'message' => 'Message envoyé avec succès.'], 200);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|min:5|max:5000',
        ]);

        $message = Message::create($validated);
        
        try {
            // L'adresse vers laquelle envoyer la notification (la vôtre)
            Mail::to('diarrassoubayassoungo33@gmail.com')->send(new ContactMessageReceived($message));
        } catch (\Exception $e) {
            // En cas d'erreur de mail, on ignore pour ne pas bloquer l'utilisateur
        }

        return response()->json(['success' => true, 'message' => 'Message envoyé avec succès.', 'data' => $message], 201);
    }

    public function show(string $id)
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }

    public function update(Request $request, string $id)
    {
        $message = Message::findOrFail($id);
        
        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $message->update($validated);
        return response()->json($message);
    }

    public function destroy(string $id)
    {
        Message::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function reply(Request $request, string $id)
    {
        $message = Message::findOrFail($id);
        
        $validated = $request->validate([
            'reply' => 'required|string',
        ]);

        try {
            Mail::to($message->email)->send(new \App\Mail\MessageReply($validated['reply']));
            $message->update(['is_read' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }

        return response()->json(['success' => true]);
    }
}
