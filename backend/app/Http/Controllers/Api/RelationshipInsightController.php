<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reflection;
use Illuminate\Http\Request;

class RelationshipInsightController extends Controller
{
    public function generate(Request $request)
    {
        $userId = $request->user()->id;

        $reflections = Reflection::with(['emotionAnalysis', 'insight'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        if ($reflections->isEmpty()) {
            return response()->json([
                'status' => true,
                'message' => 'No reflections available yet',
                'data' => null,
            ]);
        }

        $totalReflections = $reflections->count();

        $emotionCounts = [];
        $patternCounts = [];

        foreach ($reflections as $reflection) {
            $emotion = $reflection->emotionAnalysis?->emotion ?? 'neutral';
            $pattern = $reflection->insight?->pattern_detected ?? 'general self-reflection';

            $emotionCounts[$emotion] = ($emotionCounts[$emotion] ?? 0) + 1;
            $patternCounts[$pattern] = ($patternCounts[$pattern] ?? 0) + 1;
        }

        arsort($emotionCounts);
        arsort($patternCounts);

        $dominantEmotion = array_key_first($emotionCounts);
        $dominantPattern = array_key_first($patternCounts);

        $dominantPatternCount = $patternCounts[$dominantPattern] ?? 0;
        $patternPercentage = round(($dominantPatternCount / $totalReflections) * 100, 2);

        $relationshipInsight = $this->buildRelationshipInsight(
            $dominantEmotion,
            $dominantPattern,
            $patternPercentage,
            $totalReflections
        );

        return response()->json([
            'status' => true,
            'message' => 'Relationship insights generated successfully',
            'data' => [
                'total_reflections_analyzed' => $totalReflections,
                'dominant_emotion' => $dominantEmotion,
                'dominant_pattern' => $dominantPattern,
                'pattern_frequency_percentage' => $patternPercentage,
                'emotion_distribution' => $emotionCounts,
                'pattern_distribution' => $patternCounts,
                'relationship_insight' => $relationshipInsight,
            ],
        ]);
    }

    private function buildRelationshipInsight($emotion, $pattern, $percentage, $total)
    {
        $intro = "Based on {$total} reflection(s), your most recurring pattern is '{$pattern}', appearing in {$percentage}% of your entries.";

        if ($pattern === 'communication anxiety') {
            return $intro . " This suggests that communication delays, unclear responses, or feeling ignored may strongly influence your emotional reactions. You may benefit from reflecting on what you expect from communication and how clearly those expectations are expressed.";
        }

        if ($pattern === 'fear of abandonment') {
            return $intro . " This suggests a recurring concern around being left, replaced, or emotionally disconnected. A helpful next step is to examine whether this fear is based on present evidence, past experiences, or assumptions.";
        }

        if ($pattern === 'trust concern') {
            return $intro . " This suggests that trust, honesty, or reliability may be central themes in your relationship reflections. Consider identifying what specific action affected your trust and what would help rebuild emotional safety.";
        }

        if ($pattern === 'negative self-perception') {
            return $intro . " This suggests that your reflections often involve self-doubt or harsh self-judgment. A useful step is to separate facts from inner criticism and identify one strength you may be overlooking.";
        }

        if ($emotion === 'fear') {
            return $intro . " The dominant emotion is fear, which may indicate uncertainty, insecurity, or worry in your relationship experiences. Reflecting on triggers and evidence can help create clearer decisions.";
        }

        if ($emotion === 'anger') {
            return $intro . " The dominant emotion is anger, which may indicate unmet expectations, crossed boundaries, or frustration. Consider what boundary or need is trying to be communicated.";
        }

        if ($emotion === 'sadness') {
            return $intro . " The dominant emotion is sadness, which may indicate emotional distance, disappointment, or unmet relational needs. Consider what kind of support or clarity would help.";
        }

        if ($emotion === 'happy' || $emotion === 'love') {
            return $intro . " The dominant emotional tone is positive, suggesting meaningful connection or emotional satisfaction. Reflect on what is working well and how it can be sustained.";
        }

        return $intro . " This shows a recurring reflective theme. Consider reviewing the situations connected to this pattern and identifying one healthy decision you can take next.";
    }
}