<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thought extends Model
{
    use HasFactory;

    protected $table = "thoughts";
    protected $fillable = ["input_title", "input_desc", "is_checked", "date_content"];
}
