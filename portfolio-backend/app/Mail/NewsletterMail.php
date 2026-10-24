<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly object $article)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '📰 Nouvel article : ' . $this->article->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.newsletter',
            with: ['article' => $this->article],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
