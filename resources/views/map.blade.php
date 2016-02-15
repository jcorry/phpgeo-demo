@extends('layouts.master')

@section('content')
    <div class="row">
        <div class="col-sm-3">
            {{ Form::open(['method' => 'post']) }}

            {{ Form::close() }}
        </div>
        <div class="col-sm-9">
            <div id="map-canvas"></div>
        </div>
    </div>
@stop

@section('script')
    require(["map"], function(map){
        Map = new map();
    });
@stop