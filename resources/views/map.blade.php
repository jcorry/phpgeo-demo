@extends('layouts.master')

@section('content')
    <div class="row">
        <div class="col-sm-3">
            <table class="table table-striped dataTable" id="locationsTable">
                <h2>Locations</h2>
                <tbody></tbody>
                <thead>
                    <tr>
                        <th>Location Name</th>
                        <th>Lat</th>
                        <th>Lng</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <th>Location Name</th>
                        <th>Lat</th>
                        <th>Lng</th>
                    </tr>
                </tfoot>
            </table>
            {{ Form::open(['method' => 'post']) }}
                {!! Form::hidden('id', null) !!}
                <div class="form-group">
                    <label for="name">Name:</label>
                    {!! Form::text('name', null, ['class' => 'form-control']) !!}
                </div>
                <div class="form-group">
                    <label for="description">description:</label>
                    {!! Form::textarea('description', null, ['class' => 'form-control']) !!}
                </div>

                <div class="form-group">
                    <button class="btn btn-sm btn-primary" type="button" name="saveLocation">Save</button>
                    <button class="btn btn-sm btn-info" type="button" name="newLocation">New</button>
                </div>

                <div class="form-group">
                    <label for="geometry_wkt">geometry (wkt):</label>
                    {!! Form::textarea('geometry_wkt', null, ['class' => 'form-control', 'disabled' => true]) !!}
                </div>

                <div class="form-group">
                    <label for="geometry_geojson">geometry (geoJSON):</label>
                    {!! Form::textarea('geometry_geojson', null, ['class' => 'form-control', 'disabled' => true]) !!}
                </div>
            {{ Form::close() }}
        </div>
        <div class="col-sm-9">
            <div id="map-canvas"></div>
            <div class="form-group">
                <button class="btn btn-xs btn-danger disabled" id="btn-remove-shape"><i class="fa fa-remove"></i> Delete Shape</button>
            </div>
        </div>
    </div>
@stop

@section('script')
    require(["map"], function(map){
        Map = new map();
    });
@stop