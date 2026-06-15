<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use Illuminate\Http\Request;

class CoachController extends Controller
{
    public function coach(Request $request, $reflectionId)
    {
        $reflection = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($reflectionId);

        $emotion = $reflection->emotionAnalysis?->emotion ?? 'neutral';
        $pattern = $reflection->insight?->pattern_detected ?? 'general self-reflection';

        $questions = $this->generateQuestions($emotion, $pattern);

        return response()->json([
            'status' => true,
            'message' => 'Reflection coach questions generated successfully',
            'data' => [
                'reflection_id' => $reflection->id,
                'emotion' => $emotion,
                'pattern_detected' => $pattern,
                'coach_questions' => $questions,
            ],
        ]);
    }

    private function generateQuestions($emotion, $pattern)
    {
        $baseQuestions = [
            'What exactly triggered this feeling?',
            'What evidence supports this thought?',
            'What evidence challenges this thought?',
            'What is one healthy action within your control?',
        ];

        if ($emotion === 'fear') {
            return array_merge($baseQuestions, [
                'What are you afraid might happen?',
                'Is this fear based on facts, assumptions, or past experience?',
                'What would help you feel more secure in this situation?',
            ]);
        }

        if ($emotion === 'anger') {
            return array_merge($baseQuestions, [
                'What boundary do you feel was crossed?',
                'What would be a calm way to express this feeling?',
                'What outcome are you hoping for?',
            ]);
        }

        if ($emotion === 'sadness') {
            return array_merge($baseQuestions, [
                'What loss, disappointment, or need is connected to this sadness?',
                'What kind of support would help right now?',
                'What small comforting action can you take today?',
            ]);
        }

        if ($emotion === 'happy' || $emotion === 'love') {
            return array_merge($baseQuestions, [
                'What contributed to this positive feeling?',
                'How can you intentionally repeat or protect this experience?',
                'Who or what are you grateful for in this moment?',
            ]);
        }

        return $baseQuestions;
    }
}