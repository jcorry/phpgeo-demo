define(['jquery','underscore','backbone','spin', 'app' ],function($,_,Backbone,Spinner){

    HomeView = Backbone.View.extend({
        el: 'body',
        events: {

        },
        initialize: function(){
            console.log("============= LOADED HOME VIEW ==============")
            var spinner = $('body').spin();
        }
    });
    return HomeView;
});
