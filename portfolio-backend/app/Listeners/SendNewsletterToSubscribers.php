<?php

namespace App\Listeners;

use App\Events\ArticlePublished;
use App\Models\Subscriber;
use App\Mail\NewsletterMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendNewsletterToSubscribers implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(ArticlePublished $event): void
    {
        $subscribers = Subscriber::where('status', 'active')->get();
        
        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new NewsletterMail($event->article));
        }
    }
}
