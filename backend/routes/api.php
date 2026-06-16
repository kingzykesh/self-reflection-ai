<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ReflectionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\PatternController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\RelationshipInsightController;
use App\Http\Controllers\Api\GrowthTrackingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\TimelineController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::get('/emotion-trends', [AnalyticsController::class, 'emotionTrends'])
    ->middleware('auth:sanctum');

Route::get('/pattern-trends', [PatternController::class, 'patternTrends'])
    ->middleware('auth:sanctum');

Route::get('/reflection-coach/{reflectionId}', [CoachController::class, 'coach'])
    ->middleware('auth:sanctum');


Route::get('/relationship-insights', [RelationshipInsightController::class, 'generate'])
    ->middleware('auth:sanctum');

Route::get('/emotional-growth', [GrowthTrackingController::class, 'growth'])
    ->middleware('auth:sanctum');

Route::get('/reflection-report', [ReportController::class, 'generate'])
    ->middleware('auth:sanctum');

Route::get(
    '/reflection-timeline',
    [TimelineController::class, 'index']
)->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/reflections', [ReflectionController::class, 'index']);
    Route::post('/reflections', [ReflectionController::class, 'store']);
    Route::get('/reflections/{id}', [ReflectionController::class, 'show']);
});











