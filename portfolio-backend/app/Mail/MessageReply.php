<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MessageReply extends Mailable
{
    use Queueable, SerializesModels;

    public $replyMessage;

    public function __construct($replyMessage)
    {
        $this->replyMessage = $replyMessage;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réponse à votre message sur notre Portfolio',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.message_reply',
        );
    }
}
