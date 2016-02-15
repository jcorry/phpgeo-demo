define(['jquery','underscore','backbone','spin', 'global' ],function($,_,Backbone){

    HomeView = Backbone.View.extend({
        el: 'body',
        events: {

        },
        initialize: function(){
            console.log("============= LOADED HOME VIEW ==============")

        }
    });
    return HomeView;
});
