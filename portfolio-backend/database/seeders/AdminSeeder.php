<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Crée/met à jour le compte administrateur à partir de variables d'environnement.
 * Aucun mot de passe n'est écrit dans le code : ADMIN_EMAIL et ADMIN_PASSWORD
 * sont à définir dans le tableau de bord Render.
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (!$email || !$password) {
            $this->command?->warn('ADMIN_EMAIL / ADMIN_PASSWORD absents : aucun admin créé.');
            return;
        }

        if (strlen($password) < 12) {
            $this->command?->error('ADMIN_PASSWORD doit faire au moins 12 caractères.');
            return;
        }

        $user = User::firstOrNew(['email' => $email]);
        $user->forceFill([
            'name'     => $user->name ?: 'Admin',
            'password' => Hash::make($password),
        ])->save();

        $this->command?->info("Compte admin prêt : {$email}");
    }
}
