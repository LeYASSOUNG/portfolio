<x-mail::message>
# Nouveau message de contact

Vous avez reçu un nouveau message depuis votre portfolio.

**De :** {{ $messageData->name }} ({{ $messageData->email }})
**Sujet :** {{ $messageData->subject ?? 'Aucun sujet' }}

**Message :**
{{ $messageData->message }}

<x-mail::button :url="config('app.url') . '/admin'">
Voir dans l'administration
</x-mail::button>

Cordialement,<br>
Portfolio Bot
</x-mail::message>
