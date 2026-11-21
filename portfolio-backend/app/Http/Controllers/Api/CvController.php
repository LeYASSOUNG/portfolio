<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Experience;
use App\Models\Skill;
use Barryvdh\DomPDF\Facade\Pdf;

class CvController extends Controller
{
    public function download()
    {
        $experiences = Experience::orderBy('created_at', 'desc')->get();
        $skills = Skill::orderBy('level', 'desc')->get();

        $data = [
            'experiences' => $experiences,
            'skills' => $skills
        ];

        $pdf = Pdf::loadView('cv', $data);

        return $pdf->download('CV_Diarrassouba_Yassoungo.pdf');
    }
}
