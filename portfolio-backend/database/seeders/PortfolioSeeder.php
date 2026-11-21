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
        $projects = [
            [
                'title' => 'Yass Digital Lab',
                'description' => "Boutique et plateforme de produits numériques (e-books, templates prêts à l'emploi et guides pratiques) conçue pour booster la productivité des développeurs, entrepreneurs et étudiants.",
                'image' => 'Assets/images/lumina_1.png',
                'link' => 'https://yass-digital-lab.vercel.app',
                'github' => 'https://github.com/LeYASSOUNG/yass-digital-lab',
            ],
            [
                'title' => 'Portfolio Professionnel & Dashboard',
                'description' => "Application web interactive développée avec Angular 22 & Laravel 11. Comprend un tableau de bord d'administration complet, chatbot IA Gemini, multilingue et métriques GitHub en temps réel.",
                'image' => 'Assets/images/portfo image-1.png',
                'link' => 'https://portfolio-diarra-dev.vercel.app',
                'github' => 'https://github.com/LeYASSOUNG/portfolio',
            ],
            [
                'title' => 'Système de Gestion de Stock',
                'description' => "Solution de gestion de stocks et d'inventaire en temps réel : suivi des entrées/sorties de marchandises, gestion des fournisseurs, alertes de réapprovisionnement et valorisation.",
                'image' => 'Assets/images/midnight_1.png',
                'link' => 'https://github.com/LeYASSOUNG/gestion-stock',
                'github' => 'https://github.com/LeYASSOUNG/gestion-stock',
            ],
            [
                'title' => 'ProManager-CI (YA-CONSULTING)',
                'description' => "Logiciel collaboratif d'entreprise pour la gestion de projets et de tâches : planification des jalons, répartition des rôles, diagrammes d'avancement et suivi des équipes.",
                'image' => 'Assets/images/photo-1551288049-bebda4e38f71.avif',
                'link' => 'https://github.com/LeYASSOUNG/Logiciel-de-gestion-de-projet-YA-CONSULTING',
                'github' => 'https://github.com/LeYASSOUNG/ProManager-CI',
            ],
            [
                'title' => 'Jobs Platform',
                'description' => "Plateforme web de recherche et de publication d'offres d'emploi avec tableau de bord recruteur, gestion des candidatures et profils candidats avec dépôt de CV.",
                'image' => 'Assets/images/photo-1467232004584-a241de8bcf5d.avif',
                'link' => 'https://github.com/LeYASSOUNG/jobs-platform',
                'github' => 'https://github.com/LeYASSOUNG/jobs-platform',
            ],
            [
                'title' => 'QuickLodge - Réservation Hôtelière',
                'description' => "Système complet de réservation d'hébergements et séjours hôteliers avec moteur de recherche multicritère, calendrier de disponibilités et facturation sécurisée.",
                'image' => 'Assets/images/quicklodge_1.png',
                'link' => 'https://github.com/LeYASSOUNG/quicklodge',
                'github' => 'https://github.com/LeYASSOUNG/quicklodge',
            ],
            [
                'title' => 'ShopAfrica',
                'description' => "Plateforme e-commerce moderne dédiée aux produits africains, avec navigation intuitive, panier dynamique et expérience utilisateur fluide.",
                'image' => 'Assets/images/photo-1522542550221-31fd19575a2d.avif',
                'link' => 'https://github.com/LeYASSOUNG/ShopAfrica',
                'github' => 'https://github.com/LeYASSOUNG/ShopAfrica',
            ],
        ];

        foreach ($projects as $projectData) {
            Project::updateOrCreate(
                ['github' => $projectData['github']],
                $projectData
            );
        }

        // Nettoyage des anciens projets exemples de test s'ils existent
        Project::whereIn('title', ['Mon Super Projet Angular', 'Application E-commerce'])->delete();
        \Illuminate\Support\Facades\Cache::forget('projects.all');
        \Illuminate\Support\Facades\Cache::forget('chatbot.system_prompt.v2');

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
