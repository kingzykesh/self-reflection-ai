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

        return response()->json([
            'status' => true,
            'message' => 'Reflection coach generated successfully',
            'data' => [
                'reflection_id' => $reflection->id,
                'emotion' => $emotion,
                'pattern_detected' => $pattern,
                'coach_questions' => $this->generateQuestions($emotion),
                'recommended_action' => $this->recommendedAction($emotion, $pattern),
                'encouragement' => $this->encouragement($emotion),
            ],
        ]);
    }

    private function generateQuestions($emotion)
    {
        $baseQuestions = [
            'What exactly triggered this feeling?',
            'What evidence supports this thought?',
            'What evidence challenges this thought?',
            'What is one healthy action within your control?',
        ];

        return match ($emotion) {
            'fear' => array_merge($baseQuestions, [
                'What are you afraid might happen?',
                'Is this fear based on facts, assumptions, or past experience?',
                'What would help you feel more secure in this situation?',
            ]),
            'anger' => array_merge($baseQuestions, [
                'What boundary do you feel was crossed?',
                'What would be a calm way to express this feeling?',
                'What outcome are you hoping for?',
            ]),
            'sadness' => array_merge($baseQuestions, [
                'What loss, disappointment, or need is connected to this sadness?',
                'What kind of support would help right now?',
                'What small comforting action can you take today?',
            ]),
            'happy', 'love' => array_merge($baseQuestions, [
                'What contributed to this positive feeling?',
                'How can you intentionally repeat or protect this experience?',
                'Who or what are you grateful for in this moment?',
            ]),
            default => $baseQuestions,
        };
    }

    private function recommendedAction($emotion, $pattern)
    {
        if ($pattern === 'communication anxiety') {
            return 'Consider expressing one concern clearly instead of assuming the other person already understands how you feel.';
        }

        if ($pattern === 'fear of abandonment') {
            return 'Pause and separate present evidence from past fear. Then identify one safe person or action that can help you feel grounded.';
        }

        if ($pattern === 'trust concern') {
            return 'Write down the specific action that affected your trust, then decide what clarity or boundary would help rebuild emotional safety.';
        }

        if ($pattern === 'negative self-perception') {
            return 'Name one fact that challenges the harsh thought you have about yourself, then write one strength you may be overlooking.';
        }

        return match ($emotion) {
            'fear' => 'Identify the fear clearly, then write one practical step that is within your control today.',
            'anger' => 'Before reacting, name the boundary or expectation that was affected, then choose a calm way to express it.',
            'sadness' => 'Choose one gentle support action today, such as resting, writing, praying, or speaking to someone you trust.',
            'happy', 'love' => 'Notice what created this positive feeling and think about one way to sustain it intentionally.',
            default => 'Take a few minutes to name what you feel, what triggered it, and what response would help you grow.',
        };
    }

    private function encouragement($emotion)
    {
        return match ($emotion) {
            'fear' => 'Fear does not mean you are weak. It may simply be pointing to something that needs clarity and safety.',
            'anger' => 'Anger can reveal what matters to you. Handle it slowly enough for wisdom to guide your response.',
            'sadness' => 'Sadness deserves gentleness. You do not have to rush the process of understanding what it is telling you.',
            'happy' => 'Positive moments are worth noticing. They can teach you what brings peace, connection, and meaning.',
            'love' => 'Connection is meaningful when it is handled with honesty, care, and emotional responsibility.',
            default => 'Every honest reflection is progress. You are learning to observe yourself with more clarity.',
        };
    }
}