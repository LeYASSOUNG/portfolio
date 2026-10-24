<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class GuestbookEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_name',
        'user_avatar',
        'provider',
        'provider_id',
        'message',
        'is_approved',
    ];
}
