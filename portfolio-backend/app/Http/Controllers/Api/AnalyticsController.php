<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function track(Request $request)
    {
        $validated = $request->validate([
            'page_url' => 'required|string'
        ]);

        PageView::create([
            'page_url' => $validated['page_url'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        return response()->json(['status' => 'success']);
    }

    public function index()
    {
        $totalViews = PageView::count();
        $viewsByPage = PageView::select('page_url', DB::raw('count(*) as total'))
            ->groupBy('page_url')
            ->orderByDesc('total')
            ->get();
        $recentViews = PageView::orderBy('created_at', 'desc')->take(50)->get();

        return response()->json([
            'total_views' => $totalViews,
            'views_by_page' => $viewsByPage,
            'recent_views' => $recentViews
        ]);
    }
}
