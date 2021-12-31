<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
// use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all();
        return response()->json(["status" => 200, "tasks" => $tasks]);
    }


    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "input_title" => "required",
            "input_desc" => "required",
            "date_content" => "required"
        ]);

        if ($validator->fails()) {
            return response()->json(["status" => 422, "message" => $validator->errors()]);
        } else {
            $task = new Task();
            $task->input_title = $request->input("input_title");
            $task->input_desc = $request->input("input_desc");
            $task->date_content = $request->input("date_content");
            $task->save();
            return response()->json(["status" => 200, "message" => "Task added successfully."]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {

    // }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    // public function show(Task $task)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $task = Task::find($id);
        if ($task) {
            return response()->json(["status" => 200, "task" => $task]);
        } else {
            return response()->json(["status" => 404, "message" => "No Task ID found."]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            "input_title" => "required",
            "input_desc" => "required",
            "date_content" => "required"
        ]);

        if ($validator->fails()) {
            return response()->json(["status" => 422, "message" => $validator->errors()]);
        } else {
            $task = Task::find($id);

            if ($task) {
                $task->input_title = $request->input("input_title");
                $task->input_desc = $request->input("input_desc");
                $task->date_content = $request->input("date_content");
                $task->update();
                return response()->json(["status" => 200, "message" => "Task updated successfully."]);
            } else {
                return response()->json(["status" => 404, "message" => "No Task ID found."]);
            }
        }
    }

    public function checkTask($id){
        $task = Task::find($id);
        if($task){
            $task->is_checked = $task->is_checked === 0 ? 1 : 0;
            $task->update();
            return response()->json(["status" => 200, "message" => "Task {$id} toggled successfully."]);
        } else {
            return response()->json(["status" => 404, "message" => "No Task ID found."]);
        }
    }

    public function checkAllTasks($ischecked){
        Task::query()->update(["is_checked" => $ischecked]);
        return response()->json(["status" => 200, "message" => "All tasks has been toggled."]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $task = Task::find($id);
        if($task){
            $task->delete();
            return response()->json(["status" => 200, "message" => "Task deleted."]);
        } else{
            return response()->json(["status" => 404, "message" => "No Task ID found."]);
        }
    }

    public function destroyAll(){
        Task::truncate();
        return response()->json(["status" => 200, "message" => "All tasks has been deleted."]);
    }
}
