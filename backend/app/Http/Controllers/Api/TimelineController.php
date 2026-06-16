<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $timeline = Reflection::with([
                'emotionAnalysis',
                'insight'
            ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($reflection) {

                return [
                    'reflection_id' => $reflection->id,

                    'date' => $reflection
                        ->created_at
                        ->format('d M Y'),

                    'emotion' => $reflection
                        ->emotionAnalysis?->emotion ?? 'unknown',

                    'sentiment' => $reflection
                        ->emotionAnalysis?->sentiment ?? 'unknown',

                    'pattern' => $reflection
                        ->insight?->pattern_detected
                        ?? 'general reflection',
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Reflection timeline retrieved successfully',
            'data' => $timeline,
        ]);
    }
}