<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use App\Models\EmotionAnalysis;
use App\Models\Insight;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function generate(Request $request)
    {
        $user = $request->user();

        $reflections = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        $totalReflections = $reflections->count();

        $dominantEmotion = EmotionAnalysis::whereHas('reflection', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->selectRaw('emotion, COUNT(*) as total')
            ->groupBy('emotion')
            ->orderByDesc('total')
            ->first();

        $dominantPattern = Insight::whereHas('reflection', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->selectRaw('pattern_detected, COUNT(*) as total')
            ->groupBy('pattern_detected')
            ->orderByDesc('total')
            ->first();

        $data = [
            'user' => $user,
            'totalReflections' => $totalReflections,
            'dominantEmotion' => $dominantEmotion?->emotion ?? 'N/A',
            'dominantPattern' => $dominantPattern?->pattern_detected ?? 'N/A',
            'reflections' => $reflections,
            'generatedAt' => now()->format('d M Y, h:i A'),
        ];

        $pdf = Pdf::loadView('reports.reflection_report', $data);

        return $pdf->download('self_reflection_report.pdf');
    }
}