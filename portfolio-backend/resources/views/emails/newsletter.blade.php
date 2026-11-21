<x-mail::message>
# {{ $article->title }}

Bonjour !

Un nouvel article vient d'être publié sur mon blog et pourrait t'intéresser :

> {{ \Illuminate\Support\Str::limit(strip_tags($article->content), 200) }}

<x-mail::button :url="env('FRONTEND_URL', 'http://localhost:4200') . '/articles/' . $article->slug">
Lire l'article
</x-mail::button>

À bientôt,<br>
{{ config('app.name') }}
</x-mail::message>
