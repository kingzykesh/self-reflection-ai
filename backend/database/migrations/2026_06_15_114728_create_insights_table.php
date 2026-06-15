<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('insights', function (Blueprint $table) {
        $table->id();

        $table->foreignId('reflection_id')
              ->constrained()
              ->cascadeOnDelete();

        $table->text('pattern_detected');

        $table->longText('generated_insight');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insights');
    }
};
