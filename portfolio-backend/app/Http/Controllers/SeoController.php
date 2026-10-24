<?php

namespace App\Http\Controllers;

use App\Models\Seo;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    public function index()
    {
        return response()->json(Seo::all());
    }

    public function updateAll(Request $request)
    {
        $seos = $request->input('seos', []);
        foreach ($seos as $seoData) {
            Seo::updateOrCreate(
                ['page' => $seoData['page']],
                [
                    'title' => $seoData['title'],
                    'meta_description' => $seoData['meta_description'],
                    'og_image' => $seoData['og_image']
                ]
            );
        }
        return response()->json(['status' => 'success']);
    }
}
