<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Public: get approved comments for an article
    public function index(int $article_id)
    {
        $comments = Comment::where('article_id', $article_id)
                           ->where('status', 'approved')
                           ->orderBy('created_at', 'desc')
                           ->get();
        return response()->json($comments);
    }

    // Admin: get all comments
    public function adminIndex()
    {
        $comments = Comment::with('article')->orderBy('created_at', 'desc')->get();
        return response()->json($comments);
    }

    // Public: post a comment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'article_id' => 'required|exists:articles,id',
            'author' => 'required|string|max:100',
            'content' => 'required|string|max:2000'
        ]);

        $comment = Comment::create([
            'article_id' => $validated['article_id'],
            'author' => $validated['author'],
            'content' => $validated['content'],
            'status' => 'pending' // pending by default
        ]);

        return response()->json($comment, 201);
    }

    // Admin: approve/reject a comment
    public function update(Request $request, int $id)
    {
        $request->validate(['status' => 'required|in:pending,approved,rejected']);

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => $request->status]);
        return response()->json($comment);
    }

    // Admin: delete a comment
    public function destroy(int $id)
    {
        Comment::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
