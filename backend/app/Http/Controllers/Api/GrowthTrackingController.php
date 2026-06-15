<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmotionAnalysis;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GrowthTrackingController extends Controller
{
    public function growth(Request $request)
    {
        $userId = $request->user()->id;

        $last30Days = Carbon::now()->subDays(30);

        $emotions = EmotionAnalysis::whereHas('reflection', function ($query) use ($userId, $last30Days) {
                $query->where('user_id', $userId)
                      ->where('created_at', '>=', $last30Days);
            })
            ->selectRaw('emotion, COUNT(*) as total')
            ->groupBy('emotion')
            ->get();

        $totalEntries = $emotions->sum('total');

        $distribution = [];

        foreach ($emotions as $emotion) {
            $distribution[] = [
                'emotion' => $emotion->emotion,
                'count' => $emotion->total,
                'percentage' => $totalEntries > 0
                    ? round(($emotion->total / $totalEntries) * 100, 2)
                    : 0
            ];
        }

        return response()->json([
            'status' => true,
            'message' => 'Emotional growth data generated successfully',
            'data' => [
                'period' => 'Last 30 Days',
                'total_reflections' => $totalEntries,
                'emotion_distribution' => $distribution
            ]
        ]);
    }
}