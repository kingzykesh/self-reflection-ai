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
        $user = $request->user();
        $userId = $user->id;

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

        $streak = $this->calculateStreak($userId);

        return response()->json([
            'status' => true,
            'data' => [
                'total_reflections' => $totalReflections,
                'dominant_emotion' => $dominantEmotion?->emotion,
                'common_pattern' => $commonPattern?->pattern_detected,
                'streak' => $streak,
                'latest_reflection' => $latestReflection,
            ],
        ]);
    }

    private function calculateStreak($userId)
    {
        $dates = Reflection::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->pluck('created_at')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->unique()
            ->values();

        if ($dates->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $current = now()->startOfDay();

        if (!$dates->contains($current->format('Y-m-d'))) {
            $current->subDay();
        }

        while ($dates->contains($current->format('Y-m-d'))) {
            $streak++;
            $current->subDay();
        }

        return $streak;
    }
}