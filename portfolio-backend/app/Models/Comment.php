<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['article_id', 'author', 'content', 'status'];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
