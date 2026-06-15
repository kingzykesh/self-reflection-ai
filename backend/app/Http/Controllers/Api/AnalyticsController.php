<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmotionAnalysis;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function emotionTrends(Request $request)
    {
        $userId = $request->user()->id;

        $trends = EmotionAnalysis::whereHas('reflection', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->selectRaw('emotion, COUNT(*) as total')
            ->groupBy('emotion')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Emotion trends retrieved successfully',
            'data' => $trends,
        ]);
    }
}