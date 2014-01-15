var SearchFormView = Backbone.View.extend({
    events: {
        "click #clear_all": function (event) {
            this.resetFilters();
            $("#filters").submit();
        },
        "click #clear_search": function (event) {
            $("#search-input").val("");
            $("#filters").submit();
        },
       "change #id_vendors": function (event) {
            var vendor_id = $("#id_vendors").val();
            google.maps.event.trigger(vendorMap.markers[vendor_id], 'click');
            $('html, body').animate({ scrollTop: 100 }, 'slow');
       },
        "change #id_neighborhood, #id_cuisine, #id_checked_features, #id_feature": function (event) {
            $('form#filters').submit();
        }
    },

    initialize: function () {
        //TODO: this is a hack, should be able to fix this in django.
        //TODO: change the feature modelchoicefield to a choicefield
        $("#id_feature").val("");

        vendorMap.initialize("#map_canvas", vendors, "summary", autoResize);

        this.styleVegLevelPins();
    },

    styleVegLevelPins: function() {
        var vegLevels = [
            { pinSummary: "Vegan", icon: vegCategoryMarkerMapping['vegan'] },
            { pinSummary: "Vegetarian", icon: vegCategoryMarkerMapping['vegetarian'] },
            { pinSummary: "Non-Vegetarian", icon: vegCategoryMarkerMapping['omni'] }
        ];

        _.each(vegLevels, function (vegLevel) {
            var legendRowTemplate = '<tr><td><img src="<%= icon %>"> <%= pinSummary %></tr></td>',
                tableRow = _.template(legendRowTemplate)({
                    pinSummary: vegLevel.pinSummary,
                    icon: vegLevel.icon
                });

            $("#legend-table tbody").append(tableRow);
        });

        $(".veg-level-0").attr("src", vegCategoryMarkerMapping['omni']);
        $(".veg-level-7").attr("src", vegCategoryMarkerMapping['omni']);
        $(".veg-level-6").attr("src", vegCategoryMarkerMapping['omni']);
        $(".veg-level-5").attr("src", vegCategoryMarkerMapping['omni']);
        $(".veg-level-4").attr("src", vegCategoryMarkerMapping['vegetarian']);
        $(".veg-level-3").attr("src", vegCategoryMarkerMapping['vegetarian']);
        $(".veg-level-2").attr("src", vegCategoryMarkerMapping['vegetarian']);
        $(".veg-level-1").attr("src", vegCategoryMarkerMapping['vegan']);
    },

    resetFilters: function () {
        $("#id_neighborhood, #id_cuisine, #id_checked_features, #id_feature").val(0);
        $("input:checkbox").val(null);
    }

});

$(document).ready(function () {
    new SearchFormView({el: $('body') });

    function syncSelect(srcSelector, destSelector) {
        var itemName = $(srcSelector + ' :selected').text();
        $(destSelector).text(itemName);
    }

    var syncNeighborhoodMask = _.partial(syncSelect, '#id_neighborhood', '#neighborhood_mask');
    var syncCuisineMask = _.partial(syncSelect, '#id_cuisine', '#cuisine_mask');

    $('#id_neighborhood').change(syncNeighborhoodMask);
    $('#id_cuisine_tag').change(syncCuisineMask);
    $(document)
        .ready(syncNeighborhoodMask)
        .ready(syncCuisineMask);

});
