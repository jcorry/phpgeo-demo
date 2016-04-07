define(['jquery','underscore','backbone', 'app', 'jquery.spin', 'wicket','wicket.gmaps', 'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyB6Keo39AnB2e9hQa9lBPas8zAK_eAWpAc&libraries=places,drawing' ],function($,_,Backbone){

    ActionsView = Backbone.View.extend({
        el: 'body',
        events: {
            'click button.toggle-draw' : function (e) {
                this.removeCollectionPins();
                if(typeof this.geometry.setMap == 'function') {
                    this.geometry.setMap(null);
                }

                var shape = $(e.currentTarget).data('shape');

                switch(shape) {
                    case 'circle' :
                        this.drawCircle();
                    break;
                    case 'polygon':
                    default :
                        this.drawPolygon();
                        break;
                }
            }
        },
        geometry : {},
        collectionPins: [],
        map: {},
        initialize: function(){
            console.log("============= LOADED ACTIONS VIEW ==============")

            var spinner = $('body').spin();
            spinner.spin(false);
            this.initMap();

            var h = $(window).height(), offsetTop = 120;
            $('#map-canvas').css('height', (h - offsetTop));

        },
        drawCircle: function() {

            this.drawMgr = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.CIRCLE,
                drawingControl: false
            });

            google.maps.event.addListener(this.drawMgr, 'overlaycomplete', this.overlayCompleteHandler.bind(this));

            this.drawMgr.setMap(this.map);
        },
        drawPolygon: function() {

            this.drawMgr = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false
            });

            google.maps.event.addListener(this.drawMgr, 'overlaycomplete', this.overlayCompleteHandler.bind(this));

            this.drawMgr.setMap(this.map);
        },
        overlayCompleteHandler: function(e) {
            this.geometry = e.overlay;
            console.log(e.overlay);

            this.drawMgr.setOptions({
                drawingMode: null
            });
            var collection = [];
            var url = '';
            var data = {};
            
            
            switch(e.type) {
                case 'circle':
                    // get the center
                    var center = e.overlay.getCenter();
                    // get radius (in meters)
                    var radius = e.overlay.getRadius();

                    url = '/api/v1/postgis/actions/inradius';
                    data = {
                        lat: center.lat(),
                        lng: center.lng(),
                        radius: radius
                    };
                break;
                case 'polygon':
                    url = '/api/v1/postgis/actions/within';
                    data = {
                        geometry: this.getWktFromGeometry()
                    };
                break;
            }

            $.ajax({
                type: 'post',
                url: url,
                data: data
            }).done(function(response){
                this.drawCollectionPins(response.points);
            }.bind(this));
        },
        getInRadius: function() {
            // get all of the actions within a radius
        },
        getInPolygon: function() {
            // get all of the actions in the polygon
        },
        removeCollectionPins: function(){
            _.each(this.collectionPins, function( obj, idx){
                obj.setMap(null);
            });
        },
        drawCollectionPins: function(collection) {
            this.removeCollectionPins();
            _.each(collection, function(obj, idx){
                var point = this.returnMarker(obj.lat, obj.lng, 'blue');
                this.collectionPins.push(point);
                point.setMap(this.map);
            }.bind(this));
        },
        returnMarker: function(lat, lng, color) {
            var latLng = new google.maps.LatLng(lat, lng);
            var map = this.map;
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: 'Action'
            });

            return marker;
        },
        getWktFromGeometry: function() {
            wkt = new Wkt.Wkt();
            wktObj = wkt.fromObject(this.geometry);
            return wktObj.write();
        },
        initMap: function() {
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

    });
    return ActionsView;
});
