<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateAll(Request $request)
    {
        $data = $request->all();
        
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json(['message' => 'Paramètres mis à jour avec succès', 'settings' => $request->all()]);
    }

    public function exportBackup()
    {
        $backup = [
            'settings' => \App\Models\Setting::all(),
            'projects' => \App\Models\Project::all(),
            'skills' => \App\Models\Skill::all(),
            'experiences' => \App\Models\Experience::all(),
            'articles' => \App\Models\Article::all(),
            'messages' => \App\Models\Message::all(),
            'company_services' => \App\Models\CompanyService::all(),
            'testimonials' => \App\Models\Testimonial::all(),
            'subscribers' => \App\Models\Subscriber::all(),
        ];

        return response()->json($backup)
            ->header('Content-Disposition', 'attachment; filename="backup_' . date('Y_m_d_H_i_s') . '.json"');
    }
}
