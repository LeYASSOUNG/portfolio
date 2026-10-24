<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GithubController extends Controller
{
    public function stats()
    {
        $username = 'LeYASSOUNG';

        $stats = Cache::remember("github_stats_{$username}", 3600, function () use ($username) {
            $userResponse = Http::withHeaders([
                'User-Agent' => 'Portfolio-App'
            ])->get("https://api.github.com/users/{$username}");

            if ($userResponse->failed()) {
                return null;
            }
            
            $userData = $userResponse->json();

            $reposResponse = Http::withHeaders([
                'User-Agent' => 'Portfolio-App'
            ])->get("https://api.github.com/users/{$username}/repos?per_page=100&sort=updated");

            $reposData = [];
            $totalStars = 0;
            
            if ($reposResponse->successful()) {
                $repos = $reposResponse->json();
                foreach ($repos as $repo) {
                    $totalStars += $repo['stargazers_count'];
                }
                
                // Trier par étoiles décroissantes
                usort($repos, function($a, $b) {
                    return $b['stargazers_count'] <=> $a['stargazers_count'];
                });
                
                $reposData = array_slice($repos, 0, 4);
            }

            return [
                'user' => [
                    'followers' => $userData['followers'] ?? 0,
                    'public_repos' => $userData['public_repos'] ?? 0,
                    'avatar_url' => $userData['avatar_url'] ?? '',
                    'html_url' => $userData['html_url'] ?? '',
                ],
                'total_stars' => $totalStars,
                'top_repos' => array_map(function($repo) {
                    return [
                        'name' => $repo['name'],
                        'description' => $repo['description'],
                        'html_url' => $repo['html_url'],
                        'stars' => $repo['stargazers_count'],
                        'language' => $repo['language'],
                    ];
                }, $reposData)
            ];
        });

        if (!$stats) {
            return response()->json(['message' => 'Unable to fetch GitHub stats'], 500);
        }

        return response()->json($stats);
    }

    public function now()
    {
        $username = 'LeYASSOUNG';

        $data = Cache::remember("github_now_{$username}", 300, function () use ($username) {
            // Récupère le dernier événement public (dernier commit ou push)
            $eventsResponse = Http::withHeaders([
                'User-Agent' => 'Portfolio-App'
            ])->get("https://api.github.com/users/{$username}/events/public?per_page=5");

            $latestCommit = null;

            if ($eventsResponse->successful()) {
                $events = $eventsResponse->json();
                foreach ($events as $event) {
                    if ($event['type'] === 'PushEvent' && !empty($event['payload']['commits'])) {
                        $commit = end($event['payload']['commits']);
                        $latestCommit = [
                            'repo' => $event['repo']['name'],
                            'message' => $commit['message'],
                            'url' => 'https://github.com/' . $event['repo']['name'],
                            'date' => $event['created_at'],
                        ];
                        break;
                    }
                }
            }

            return [
                'github' => $latestCommit,
                'spotify' => null, // À connecter plus tard
            ];
        });

        return response()->json($data);
    }
}
