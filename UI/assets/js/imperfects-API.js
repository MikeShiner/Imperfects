$(document).ready(function () {


    var loadOptions = function () {
        $.get("/api/options", function (data) {

            var sizeSelector = $('.size-selector');
            var brandSelector = null;

            data.sizes.forEach(function (element) {
                option = $('<option>').attr("value", element).html(element);
                sizeSelector.append(option);
            });
        });
    };

    var loadTrainers = function (page, size) {
        var queryString = "?page=";
        if (!page) {
            page = 1;
        }
        queryString = queryString + page;

        if (size) {
            queryString = queryString + "&size=" + size;
        }

        $.get("/api" + queryString, function (data) {
            // $('#products').html(JSON.stringify(data));
        });
    };

    var registerEventHandlers = function () {
        $('.size-selector').change(function (e) {
            loadTrainers(null, e.target.value);
        });
    }

    loadOptions();
    registerEventHandlers();
    loadTrainers(null);
});