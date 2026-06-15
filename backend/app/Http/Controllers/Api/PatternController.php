<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Insight;
use Illuminate\Http\Request;

class PatternController extends Controller
{
    public function patternTrends(Request $request)
    {
        $userId = $request->user()->id;

        $patterns = Insight::whereHas('reflection', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->selectRaw('pattern_detected, COUNT(*) as total')
            ->groupBy('pattern_detected')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Pattern trends retrieved successfully',
            'data' => $patterns,
        ]);
    }
}