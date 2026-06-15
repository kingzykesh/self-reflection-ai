<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reflection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reflection_text',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function emotionAnalysis()
    {
        return $this->hasOne(EmotionAnalysis::class);
    }

    public function insight()
    {
        return $this->hasOne(Insight::class);
    }
}