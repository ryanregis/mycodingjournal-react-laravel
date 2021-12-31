<?php

namespace App\Http\Controllers;

use App\Models\Thought;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
// use App\Http\Controllers\Controller;

class ThoughtController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $thoughts = Thought::all();
        return response()->json(["status" => 200, "thoughts" => $thoughts]);
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
            $thought = new Thought();
            $thought->input_title = $request->input("input_title");
            $thought->input_desc = $request->input("input_desc");
            $thought->date_content = $request->input("date_content");
            $thought->save();
            return response()->json(["status" => 200, "message" => "Thought added successfully."]);
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
     * @param  \App\Models\Thought  $thought
     * @return \Illuminate\Http\Response
     */
    // public function show(thought $thought)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\thought  $thought
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $thought = Thought::find($id);
        if ($thought) {
            return response()->json(["status" => 200, "thought" => $thought]);
        } else {
            return response()->json(["status" => 404, "message" => "No thought ID found."]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Thought  $thought
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
            $thought = Thought::find($id);

            if ($thought) {
                $thought->input_title = $request->input("input_title");
                $thought->input_desc = $request->input("input_desc");
                $thought->date_content = $request->input("date_content");
                $thought->update();
                return response()->json(["status" => 200, "message" => "Thought updated successfully."]);
            } else {
                return response()->json(["status" => 404, "message" => "No Thought ID found."]);
            }
        }
    }

    public function checkThought($id){
        $thought = Thought::find($id);
        if($thought){
            $thought->is_checked = $thought->is_checked === 0 ? 1 : 0;
            $thought->update();
            return response()->json(["status" => 200, "message" => "Thought {$id} toggled successfully."]);
        } else {
            return response()->json(["status" => 404, "message" => "No Thought ID found."]);
        }
    }

    public function checkAllThoughts($ischecked){
        Thought::query()->update(["is_checked" => $ischecked]);
        return response()->json(["status" => 200, "message" => "All thoughts has been toggled."]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Thought  $thought
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $thought = Thought::find($id);
        if($thought){
            $thought->delete();
            return response()->json(["status" => 200, "message" => "Thought deleted."]);
        } else{
            return response()->json(["status" => 404, "message" => "No Thought ID found."]);
        }
    }

    public function destroyAll(){
        Thought::truncate();
        return response()->json(["status" => 200, "message" => "All thoughts has been deleted."]);
    }
}
