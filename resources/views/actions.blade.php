@extends('layouts.master')

@section('content')
    <div class="row">
        <div class="col-sm-12">
            <div id="map-canvas"></div>
            <div class="form-group">
                <button class="btn btn-xs btn-primary toggle-draw" data-shape="circle" id="btn-draw-circle"><i class="fa fa-circle-thin"></i> Draw Circle</button>
                <button class="btn btn-xs btn-primary toggle-draw" data-shape="polygon" id="btn-draw-polygon"><i class="fa fa-map-marker"></i> Draw Polygon</button>
            </div>
        </div>
    </div>
@stop

@section('script')
    require(["actions"], function(actions){
        Actions = new actions();
    });
@stop