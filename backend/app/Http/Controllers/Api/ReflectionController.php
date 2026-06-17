<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use App\Models\EmotionAnalysis;
use App\Models\Insight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ReflectionController extends Controller
{
    public function index(Request $request)
    {
        $reflections = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Reflections retrieved successfully',
            'data' => $reflections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reflection_text' => 'required|string|min:10',
        ]);

        $reflection = Reflection::create([
            'user_id' => $request->user()->id,
            'reflection_text' => $validated['reflection_text'],
        ]);

        try {
           $response = Http::timeout(30)->post(env('AI_SERVICE_URL') . '/analyze', [
                'text' => $validated['reflection_text'],
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'status' => false,
                    'message' => 'AI service failed to analyze reflection',
                    'error' => $response->json(),
                ], 500);
            }

            $aiResult = $response->json();

            $emotion = EmotionAnalysis::create([
                'reflection_id' => $reflection->id,
                'emotion' => $aiResult['emotion'] ?? 'neutral',
                'confidence_score' => $aiResult['confidence_score'] ?? 0,
                'sentiment' => $aiResult['sentiment'] ?? 'neutral',
            ]);

          $insight = Insight::create([
    'reflection_id' => $reflection->id,
    'pattern_detected' => $aiResult['pattern_detected'] ?? 'general self-reflection',
    'generated_insight' => $aiResult['generated_insight'] ?? 'Your reflection has been received. Keep reflecting intentionally.',
    'coach_question' => $aiResult['coach_question'] ?? null,
    'recommended_action' => $aiResult['recommended_action'] ?? null,
    'encouragement' => $aiResult['encouragement'] ?? null,
]);
            return response()->json([
                'status' => true,
                'message' => 'Reflection analyzed successfully',
                'data' => [
                    'reflection' => $reflection,
                    'emotion_analysis' => $emotion,
                    'insight' => $insight,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Unable to connect to AI service',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $reflection = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Reflection retrieved successfully',
            'data' => $reflection,
        ]);
    }
}