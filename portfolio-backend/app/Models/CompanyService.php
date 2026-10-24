<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyService extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon',
        'title',
        'description',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];
}
