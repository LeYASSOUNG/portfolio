<?php

namespace App\Mail;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvel article : ' . $this->article->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.newsletter',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
