<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\ScoreController;

// Routes publiques
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store'])->middleware('throttle:3,1');
Route::get('/scores', [ScoreController::class, 'index']);
Route::post('/scores', [ScoreController::class, 'store'])->middleware('throttle:10,1');
Route::post('/visits', [StatsController::class, 'recordVisit'])->middleware('throttle:60,1');
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
Route::get('/company-services', [\App\Http\Controllers\Api\CompanyServiceController::class, 'index']);
Route::post('/analytics/track', [\App\Http\Controllers\Api\AnalyticsController::class, 'track'])->middleware('throttle:60,1');
Route::post('/subscribe', [\App\Http\Controllers\Api\SubscriberController::class, 'subscribe'])->middleware('throttle:3,1');
Route::post('/chat', [\App\Http\Controllers\Api\ChatController::class, 'chat'])->middleware('throttle:10,1');
Route::get('/testimonials', [\App\Http\Controllers\Api\TestimonialController::class, 'index']);
Route::get('/articles/{id}/comments', [\App\Http\Controllers\Api\CommentController::class, 'index'])->whereNumber('id');
Route::post('/articles/{id}/comments', [\App\Http\Controllers\Api\CommentController::class, 'store'])->whereNumber('id')->middleware('throttle:5,1');
Route::get('/github/stats', [\App\Http\Controllers\Api\GithubController::class, 'stats']);
Route::get('/now', [\App\Http\Controllers\Api\GithubController::class, 'now']);
Route::get('/cv/download', [\App\Http\Controllers\Api\CvController::class, 'download']);
Route::get('/seo', [\App\Http\Controllers\SeoController::class, 'index']);

// Socialite Auth
Route::get('/auth/{provider}/redirect', [\App\Http\Controllers\Api\SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [\App\Http\Controllers\Api\SocialAuthController::class, 'callback']);

// Guestbook
Route::get('/guestbook', [\App\Http\Controllers\Api\GuestbookController::class, 'index']);

// Routes accessibles à tout utilisateur authentifié (admin ou visiteur GitHub)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return array_merge($request->user()->toArray(), [
            'is_admin' => $request->user()->tokenCan('admin'),
        ]);
    });
});

// Livre d'or : token GitHub (capacité "guestbook") requis
Route::middleware(['auth:sanctum', 'abilities:guestbook', 'throttle:5,1'])->group(function () {
    Route::post('/guestbook', [\App\Http\Controllers\Api\GuestbookController::class, 'store']);
});

// Routes protégées par authentification (Admin) — capacité "admin" obligatoire
Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    Route::put('/user/credentials', [AuthController::class, 'updateCredentials']);
    
    Route::apiResource('projects', ProjectController::class)->except(['index', 'show']);
    Route::apiResource('experiences', ExperienceController::class)->except(['index', 'show']);
    Route::apiResource('skills', SkillController::class)->except(['index', 'show']);
    Route::apiResource('messages', MessageController::class)->only(['index', 'destroy']);
    Route::apiResource('articles', ArticleController::class)->except(['index', 'show']);
    Route::get('/stats', [StatsController::class, 'getStats']);
    
    // Lecture et suppression des messages (admin seulement) - couverts par apiResource ci-dessus
    Route::get('messages/{id}', [MessageController::class, 'show']);
    Route::post('messages/{id}/reply', [MessageController::class, 'reply']);
    
    Route::post('/settings', [\App\Http\Controllers\Api\SettingController::class, 'updateAll']);
    Route::apiResource('company-services', \App\Http\Controllers\Api\CompanyServiceController::class)->except(['index', 'show']);
    Route::delete('/scores/{id}', [ScoreController::class, 'destroy'])->whereNumber('id');
    
    Route::get('/admin/analytics', [\App\Http\Controllers\Api\AnalyticsController::class, 'index']);
    Route::get('/admin/subscribers', [\App\Http\Controllers\Api\SubscriberController::class, 'index']);
    Route::post('/admin/newsletter/send', [\App\Http\Controllers\Api\SubscriberController::class, 'sendNewsletter']);
    Route::delete('/admin/subscribers/{id}', [\App\Http\Controllers\Api\SubscriberController::class, 'destroy']);
    Route::apiResource('testimonials', \App\Http\Controllers\Api\TestimonialController::class)->except(['index', 'show']);
    Route::get('/admin/comments', [\App\Http\Controllers\Api\CommentController::class, 'adminIndex']);
    Route::put('/admin/comments/{id}', [\App\Http\Controllers\Api\CommentController::class, 'update'])->whereNumber('id');
    Route::delete('/admin/comments/{id}', [\App\Http\Controllers\Api\CommentController::class, 'destroy'])->whereNumber('id');
    Route::get('/admin/backup', [\App\Http\Controllers\Api\SettingController::class, 'exportBackup']);
    Route::post('/admin/seo', [\App\Http\Controllers\SeoController::class, 'updateAll']);

    // Media Manager
    Route::get('/admin/media', [MediaController::class, 'index']);
    Route::post('/admin/media', [MediaController::class, 'store']);
    Route::post('/admin/media/create-folder', [MediaController::class, 'createFolder']);
    Route::delete('/admin/media', [MediaController::class, 'destroy']);
});
