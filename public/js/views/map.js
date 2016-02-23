define(['jquery','underscore','backbone', 'jquery.spin', 'app', 'wicket', 'wicket.gmaps' ],function($, _, Backbone){

    MapView = Backbone.View.extend({
        el: 'body',
        events: {
            "click button[name='newLocation']" : function(e) {
                this.newLocation();
            },
            "click button[name='saveLocation']" : function(e) {
                var data = {

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

            }.bind(this));

            if(this.geometry.type == google.maps.drawing.OverlayType.POLYGON) {
                this.geometry.setMap(null);
            }

            this.drawMgr.setMap(this.map);
        },
        saveLocation : function() {

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
            }
        },
        getWktFromGeometry: function() {

        },
        getGeoJsonFromGeometry: function() {

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
