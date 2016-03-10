define(['jquery','underscore','backbone','datatables','jquery.spin','app','wicket','wicket.gmaps','async!https://maps.googleapis.com/maps/api/js?key=AIzaSyB6Keo39AnB2e9hQa9lBPas8zAK_eAWpAc&libraries=places,drawing'],function($, _, Backbone){

    MapView = Backbone.View.extend({
        el: 'body',
        events: {
            "click button[name='newLocation']" : function(e) {
                this.newLocation();
            },
            "click button[name='saveLocation']" : function(e) {
                var data = {
                    id : $('input[name="id"]').val(),
                    geometryWkt : $('textarea[name="geometry_wkt"]').val(),
                    geometryGeoJson : this.getGeoJsonFromGeometry(),
                    name : $('input[name="name"]').val(),
                    description : $('textarea[name="description"]').val()
                };

                this.saveLocation(data);
            }
        },
        map : {},
        drawMgr : null,
        geometry : {},
        initialize: function(){
            console.log("============= LOADED HOME VIEW ==============")
            var spinner = $('body').spin();
            spinner.spin(false);
            this.initMap();

            var h = $(window).height(), offsetTop = 120;
            $('#map-canvas').css('height', (h - offsetTop));

            this.listLocations();

        },
        listLocations : function() {
            console.log()
            this.locationsTable = $('table#locationsTable').DataTable({
                ajax : {
                    url : '/locations/list',
                    type : 'GET',
                    data : {}
                },
                columns : [
                    {data : 'name'},
                    {data : 'lat'},
                    {data : 'lng'}
                ]
            });
        },
        loadLocation : function() {

        },
        newLocation : function() {
            // remove existing polygon
            // drawing manager on
            this.drawMgr = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false
            });

            google.maps.event.addListener(this.drawMgr, 'overlaycomplete', function(e){
                this.drawMgr.setOptions({
                    drawingMode : null
                });
                this.geometry = e.overlay;
                this.geometry.type = e.type;

                console.log(this.geometry.getPath());

                google.maps.event.addListener(this.geometry, 'click', function(e){
                    this.areaToggleEditable();
                }.bind(this));

                $('textarea[name="geometry_wkt"]').val(this.getWktFromGeometry());
                $('textarea[name="geometry_geojson"]').val(JSON.stringify(this.getGeoJsonFromGeometry()));

                $('#btn-remove-shape').off();
                $('#btn-remove-shape').removeClass('disabled');

                $('#btn-remove-shape').on('click', function(e){
                    this.geometry.setMap(null);
                    $('#btn-remove-shape').addClass('disabled');
                }.bind(this));

                var path = this.geometry.getPath();

                google.maps.event.addListener(path, 'set_at', function(){
                    $('textarea[name="geometry_wkt"]').val(this.getWktFromGeometry());
                }.bind(this));

                google.maps.event.addListener(path, 'insert_at', function(){
                    $('textarea[name="geometry_wkt"]').val(this.getWktFromGeometry());
                }.bind(this));

            }.bind(this));

            if(this.geometry.type == google.maps.drawing.OverlayType.POLYGON) {
                this.geometry.setMap(null);
            }

            this.drawMgr.setMap(this.map);
        },
        saveLocation : function(locationData) {
            $('body').spin();
            $.ajax({
                url : '/locations/save',
                type : 'post',
                data : locationData
            }).done(function(response){
                console.log(response);
                this.locationsTable.ajax.reload();
                $('body').spin(false);
            }.bind(this));
        },
        areaToggleEditable: function() {
            // make it editable if it's not
            var editableOptions = {
                editable: true,
                draggable: true,
                fillColor: '#FF2610',
                strokeColor: '#931105'
            }

            var defaultOptions = {
                editable: false,
                draggable: false,
                fillColor: '#000000',
                strokeColor: '#000000'
            }

            if(!this.geometry.editable) {
                this.geometry.setOptions(editableOptions);
                this.geometry.editable = true;
            } else {
                this.geometry.setOptions(defaultOptions);
                this.geometry.editable = false;
                // update the geometry textarea
                wkt = new Wkt.Wkt();
                wktObj = wkt.fromObject(this.geometry);
                $('textarea[name="geometry_wkt"]').val(this.getWktFromGeometry());
            }
        },
        getWktFromGeometry: function() {
            wkt = new Wkt.Wkt();
            wktObj = wkt.fromObject(this.geometry);
            return wktObj.write();
        },
        getGeoJsonFromGeometry: function() {

            return exportGeoJson(this.geometry);

            function exportGeoJson(polygon) {
                var geoJson = {
                    type : "FeatureCollection",
                    features : []
                };
                var polygonFeature = {
                    type : "Feature",
                        geometry : {
                            type : "Polygon",
                            coordinates : []
                        },
                    properties : {}
                };
                for(var i = 0; i < polygon.getPath().getLength(); i++) {
                    var pt = polygon.getPath().getAt(i);
                    polygonFeature.geometry.coordinates.push([pt.lng(), pt.lat()]);
                }
                geoJson.features.push(polygonFeature);

                return geoJson;
            }
        },
        initMap : function() {
            var center = {
                lat: 33.762909,
                lng: -84.422675
            };
            this.map = new google.maps.Map(document.getElementById('map-canvas'), {
                center : center,
                zoom : 8
            });
            // drawing manager
            this.drawMgr = new google.maps.drawing.DrawingManager();
        }
    });
    return MapView;
});
