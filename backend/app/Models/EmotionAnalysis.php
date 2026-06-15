<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EmotionAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'reflection_id',
        'emotion',
        'confidence_score',
        'sentiment',
    ];

    public function reflection()
    {
        return $this->belongsTo(Reflection::class);
    }
}