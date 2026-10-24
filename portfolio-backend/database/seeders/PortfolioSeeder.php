<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Experience;
use App\Models\Skill;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        Project::create([
            'title' => 'Mon Super Projet Angular',
            'description' => 'Un projet incroyable réalisé avec Angular 22 et Laravel 11.',
            'image' => 'https://via.placeholder.com/600x400',
            'link' => 'https://github.com/LeYASSOUNG/portfolio',
            'github' => 'https://github.com/LeYASSOUNG/portfolio',
        ]);

        Project::create([
            'title' => 'Application E-commerce',
            'description' => 'Boutique en ligne avec panier et paiement Stripe.',
            'image' => 'https://via.placeholder.com/600x400',
            'link' => 'https://maboutique.com',
        ]);

        Experience::create([
            'title' => 'Développeur Full-Stack',
            'company' => 'Tech Solutions Inc.',
            'start_date' => '2023-01-01',
            'description' => 'Développement d\'applications web avec Angular et Laravel.',
        ]);

        Experience::create([
            'title' => 'Développeur Frontend Junior',
            'company' => 'Web Agency',
            'start_date' => '2021-06-01',
            'end_date' => '2022-12-31',
            'description' => 'Création de sites vitrines et intégration maquettes.',
        ]);

        Skill::create(['name' => 'Angular', 'category' => 'Frontend', 'level' => 90]);
        Skill::create(['name' => 'Laravel', 'category' => 'Backend', 'level' => 85]);
        Skill::create(['name' => 'PostgreSQL', 'category' => 'Database', 'level' => 80]);
        Skill::create(['name' => 'TypeScript', 'category' => 'Language', 'level' => 95]);
    }
}
