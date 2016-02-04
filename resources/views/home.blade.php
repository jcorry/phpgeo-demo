@extends('layouts.master')

@section('content')
    <div class="title">Laravel 5</div>
@stop

@section('script')
    require(["home"], function(home){
        Home = new home();
    });
@stop