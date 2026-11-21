<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompanyService;
use Illuminate\Http\Request;

class CompanyServiceController extends Controller
{
    public function index()
    {
        return response()->json(CompanyService::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'icon' => 'nullable|string',
            'title' => 'required|string',
            'description' => 'required|string',
            'tags' => 'nullable|array'
        ]);

        $service = CompanyService::create($validated);
        return response()->json($service, 201);
    }

    public function update(Request $request, $id)
    {
        $companyService = CompanyService::findOrFail($id);
        $validated = $request->validate([
            'icon' => 'nullable|string',
            'title' => 'required|string',
            'description' => 'required|string',
            'tags' => 'nullable|array'
        ]);

        $companyService->update($validated);
        return response()->json($companyService);
    }

    public function destroy($id)
    {
        CompanyService::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
