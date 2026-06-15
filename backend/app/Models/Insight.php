<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Insight extends Model
{
    use HasFactory;

    protected $fillable = [
        'reflection_id',
        'pattern_detected',
        'generated_insight',
    ];

    public function reflection()
    {
        return $this->belongsTo(Reflection::class);
    }
}