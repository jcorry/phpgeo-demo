define(['jquery','underscore','backbone', 'jquery.spin', 'app' ],function($,_,Backbone){

    MapView = Backbone.View.extend({
        el: 'body',
        events: {

        },
        map : {},
        initialize: function(){
            console.log("============= LOADED HOME VIEW ==============")
            var spinner = $('body').spin();
            spinner.spin(false);
            this.initMap();

            var h = $(window).height(), offsetTop = 120;
            $('#map-canvas').css('height', (h - offsetTop));


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
        }
    });
    return MapView;
});
