<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->string('player_name');
            $table->integer('score'); // Ex: Nombre de mots trouvés (bien que dans ce jeu, on gagne quand tout est trouvé)
            $table->integer('time_taken'); // Temps en secondes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
