<?php

namespace Tests\Feature;

use App\Models\Experience;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_endpoint_returns_success_and_caches_data(): void
    {
        Project::create([
            'title' => 'Portfolio Angular',
            'description' => 'Super portfolio moderne',
            'link' => 'https://example.com',
            'github' => 'https://github.com/LeYASSOUNG/portfolio',
        ]);

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Portfolio Angular']);
    }

    public function test_skills_endpoint_returns_skills_list(): void
    {
        Skill::create([
            'name' => 'Angular',
            'category' => 'Frontend',
            'level' => 90,
        ]);

        $response = $this->getJson('/api/skills');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['name' => 'Angular']);
    }

    public function test_experiences_endpoint_returns_experiences_list(): void
    {
        Experience::create([
            'title' => 'Lead Développeur Full Stack',
            'company' => 'Yass Digital Lab',
            'start_date' => '2024-01-01',
            'description' => 'Conception de solutions web',
        ]);

        $response = $this->getJson('/api/experiences');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['company' => 'Yass Digital Lab']);
    }

    public function test_contact_form_saves_message_and_sends_email(): void
    {
        Mail::fake();

        $payload = [
            'name' => 'Recruteur Tech',
            'email' => 'recruteur@company.com',
            'subject' => 'Proposition de mission',
            'message' => 'Bonjour Yassoungo, votre profil nous intéresse beaucoup !',
        ];

        $response = $this->postJson('/api/messages', $payload);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('messages', [
            'email' => 'recruteur@company.com',
        ]);

        Mail::assertSent(\App\Mail\ContactMessageReceived::class);
    }

    public function test_contact_form_honeypot_silently_drops_spambots(): void
    {
        Mail::fake();

        $botPayload = [
            'name' => 'Spam Bot',
            'email' => 'spambot@spam.com',
            'subject' => 'Buy cheap links',
            'message' => 'Spam spam spam http://spam.xyz',
            '_gotcha' => 'I am a hidden bot input',
        ];

        $response = $this->postJson('/api/messages', $botPayload);

        // Réponse 200 feinte sans erreur pour tromper le bot
        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        // Rien ne doit être stocké en base
        $this->assertDatabaseMissing('messages', [
            'email' => 'spambot@spam.com',
        ]);

        // Aucun mail ne doit être envoyé
        Mail::assertNothingSent();
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->postJson('/api/messages', [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '123', // trop court
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message']);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@admin.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }
}
