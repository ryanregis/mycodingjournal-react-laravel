<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ThoughtController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// *Create
Route::post("/addtask", [TaskController::class, "create"]);
Route::post("/addthought", [ThoughtController::class, "create"]);

// ? Read
Route::get("/retrievetasks", [TaskController::class, "index"]);
Route::get("/retrievethoughts", [ThoughtController::class, "index"]);

// & Edit and Update
Route::get("/edittask/{id}", [TaskController::class, "edit"]);
Route::get("/editthought/{id}", [ThoughtController::class, "edit"]);

Route::put("/updatetask/{id}", [TaskController::class, "update"]);
Route::put("/updatethought/{id}", [ThoughtController::class, "update"]);

Route::put("/checktask/{id}", [TaskController::class, "checkTask"]);
Route::put("/checkthought/{id}", [ThoughtController::class, "checkThought"]);

Route::put("/checkalltasks/{ischecked}", [TaskController::class, "checkAllTasks"]);
Route::put("/checkallthoughts/{ischecked}", [ThoughtController::class, "checkAllThoughts"]);

//! Single Deletion or Total Deletion
Route::delete("/deletetask/{id}", [TaskController::class, "destroy"]);
Route::delete("/deletethought/{id}", [ThoughtController::class, "destroy"]);

Route::delete("/truncatetask", [TaskController::class, "destroyAll"]);
Route::delete("/truncatethought", [ThoughtController::class, "destroyAll"]);
