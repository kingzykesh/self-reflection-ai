<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use App\Models\EmotionAnalysis;
use App\Models\Insight;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        $totalReflections = Reflection::where('user_id', $userId)->count();

        $latestReflection = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $userId)
            ->latest()
            ->first();

        $dominantEmotion = EmotionAnalysis::whereHas('reflection', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->selectRaw('emotion, COUNT(*) as total')
            ->groupBy('emotion')
            ->orderByDesc('total')
            ->first();

        $commonPattern = Insight::whereHas('reflection', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->selectRaw('pattern_detected, COUNT(*) as total')
            ->groupBy('pattern_detected')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'status' => true,
            'data' => [
                'total_reflections' => $totalReflections,
                'dominant_emotion' => $dominantEmotion?->emotion,
                'common_pattern' => $commonPattern?->pattern_detected,
                'latest_reflection' => $latestReflection,
            ],
        ]);
    }
}