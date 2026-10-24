<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{
    /** Fournisseurs OAuth autorisés */
    private const ALLOWED_PROVIDERS = ['github'];

    public function redirect(string $provider)
    {
        return $this->driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        $driver = $this->driver($provider);

        $frontendUrl = config('app.frontend_url');

        try {
            $socialUser = $driver->user();
            $githubId   = (string) $socialUser->getId();

            // Identification par l'ID GitHub (jamais par l'email) pour éviter
            // qu'un compte GitHub n'écrase un compte existant (ex: l'admin).
            $user = User::where('github_id', $githubId)->first();

            if ($user) {
                // Mise à jour du profil uniquement — le mot de passe n'est jamais touché
                $user->update([
                    'name'   => $socialUser->getName() ?? $socialUser->getNickname(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            } else {
                // Email absent ou déjà utilisé par un autre compte → email de substitution unique
                $email = $socialUser->getEmail();
                if (!$email || User::where('email', $email)->exists()) {
                    $email = "github_{$githubId}@users.noreply.github.com";
                }

                $user = User::create([
                    'name'      => $socialUser->getName() ?? $socialUser->getNickname(),
                    'email'     => $email,
                    'github_id' => $githubId,
                    'avatar'    => $socialUser->getAvatar(),
                    'password'  => bcrypt(str()->random(40)),
                ]);
            }

            // Token limité au livre d'or : aucun accès aux routes admin
            $token = $user->createToken('guestbook-token', ['guestbook'])->plainTextToken;

            // Redirect back to frontend with token
            return redirect($frontendUrl . '/guestbook?token=' . $token);
        } catch (\Exception $e) {
            return redirect($frontendUrl . '/guestbook?error=auth_failed');
        }
    }

    /**
     * Retourne le driver OAuth (sans session) après vérification du fournisseur.
     */
    private function driver(string $provider): AbstractProvider
    {
        abort_unless(in_array($provider, self::ALLOWED_PROVIDERS, true), 404);

        /** @var AbstractProvider $driver */
        $driver = Socialite::driver($provider);

        return $driver->stateless();
    }
}
