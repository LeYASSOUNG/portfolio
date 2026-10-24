<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Révoque les anciens tokens du livre d'or.
     *
     * Ils ont été créés sans capacité explicite (donc "*") et passeraient
     * encore le middleware "abilities:admin". Les visiteurs devront simplement
     * se reconnecter via GitHub pour obtenir un token limité au livre d'or.
     * Les tokens admin existants ne sont pas touchés.
     */
    public function up(): void
    {
        DB::table('personal_access_tokens')
            ->where('name', 'guestbook-token')
            ->delete();
    }

    public function down(): void
    {
        // Irréversible : les tokens révoqués ne peuvent pas être restaurés.
    }
};
