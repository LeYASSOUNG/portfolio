<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Events\ArticlePublished;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index()
    {
        return response()->json(Article::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $article = new Article($request->only(['title', 'content', 'image', 'is_published']));
        $article->slug = Str::slug($request->title) . '-' . uniqid();
        $article->save();

        if ($article->is_published) {
            event(new ArticlePublished($article));
        }

        return response()->json($article, 201);
    }

    public function show(string|int $idOrSlug)
    {
        $article = Article::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();
        return response()->json($article);
    }

    public function update(Request $request, Article $article)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        $article->fill($request->only(['title', 'content', 'image', 'is_published']));
        if ($article->isDirty('title')) {
            $article->slug = Str::slug($request->title) . '-' . uniqid();
        }
        $article->save();

        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return response()->json(null, 204);
    }
}
