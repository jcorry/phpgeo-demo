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
            },
            "click a.loadLocation" : function(e) {
                var locationId = $(e.currentTarget).data('locationid');
                this.loadLocation(locationId);
            },
            "click a.deleteLocation" : function(e) {
                var locationId = $(e.currentTarget).data('locationid');
                console.log('delete location: ' + locationId);
            }
        },
        map : {},
        drawMgr : null,
        geometry : {},
        features : [],
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
                    url : '/api/v1/mysql/locations',
                    type : 'GET',
                    data : {}
                },
                columns : [
                    {data : 'name'},
                    {data : 'lat'},
                    {data : 'lng'},
                    {data : function(row, type, set){
                        var html = '<a href="#" class="btn btn-xs btn-primary loadLocation" data-locationid="' + row.id + '">Load</a>';
                        html += ' <a href="#" class="btn btn-xs btn-danger deleteLocation" data-locationid="' + row.id + '"><i class="fa fa-remove"></i></a>';
                        return html;
                    }}
                ],
                createdRow : function(row, data, dataIndex) {
                    $(row).attr('id', 'location-' + data.id);
                }

            });
        },
        loadLocation : function(locationId) {
            console.log('load location: ' + locationId);
            var data = this.locationsTable.row("#location-" + locationId).data();
            // set the geometry
            wkt = new Wkt.Wkt();
            wkt.read(data.bounds_wkt);

            if((locationId in this.features)) {
                this.features[locationId].setMap(null);
            }

            this.features[locationId] = wkt.toObject(this.map.defaults);


            // Add listeners for overlay editing events
            if (!Wkt.isArray(this.features[locationId]) && wkt.type !== 'point') {
                // New vertex is inserted
                google.maps.event.addListener(this.features[locationId], 'click', function(n){
                    this.areaToggleEditable();
                }.bind(this));

                google.maps.event.addListener(this.features[locationId].getPath(), 'insert_at', function (n) {
                    this.updateText();
                }.bind(this));
                // Existing vertex is removed (insertion is undone)
                google.maps.event.addListener(this.features[locationId].getPath(), 'remove_at', function (n) {
                    this.updateText();
                }.bind(this));
                // Existing vertex is moved (set elsewhere)
                google.maps.event.addListener(this.features[locationId].getPath(), 'set_at', function (n) {
                    this.updateText();
                }.bind(this));
            } else {
                if (this.features[locationId].setEditable) {this.features[locationId].setEditable(false);}
            }

            var bounds = new google.maps.LatLngBounds();

            this.features[locationId].setMap(this.map);

            this.features[locationId].getPath().forEach(function(element, index){bounds.extend(element)});

            this.map.fitBounds(bounds);

            this.geometry = this.features[locationId];

            // populate the form
            this.updateText();
            // add the editable polygon to the map

            console.log(data);
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

                this.updateText();

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
                zoom : 8,
                defaults : {
                    editable: false,
                    draggable: false,
                    fillColor: '#000000',
                    strokeColor: '#000000'
                }
            });
            // drawing manager
            this.drawMgr = new google.maps.drawing.DrawingManager();
        },
        updateText : function() {
            $('textarea[name="geometry_wkt"]').val(this.getWktFromGeometry());
            $('textarea[name="geometry_geojson"]').val(JSON.stringify(this.getGeoJsonFromGeometry()));

        }
    });
    return MapView;
});
