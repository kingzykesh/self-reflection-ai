<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('insights', function (Blueprint $table) {
            if (!Schema::hasColumn('insights', 'coach_question')) {
                $table->text('coach_question')->nullable()->after('generated_insight');
            }

            if (!Schema::hasColumn('insights', 'recommended_action')) {
                $table->text('recommended_action')->nullable()->after('coach_question');
            }

            if (!Schema::hasColumn('insights', 'encouragement')) {
                $table->text('encouragement')->nullable()->after('recommended_action');
            }
        });
    }

    public function down(): void
    {
        Schema::table('insights', function (Blueprint $table) {
            if (Schema::hasColumn('insights', 'encouragement')) {
                $table->dropColumn('encouragement');
            }

            if (Schema::hasColumn('insights', 'recommended_action')) {
                $table->dropColumn('recommended_action');
            }

            if (Schema::hasColumn('insights', 'coach_question')) {
                $table->dropColumn('coach_question');
            }
        });
    }
};