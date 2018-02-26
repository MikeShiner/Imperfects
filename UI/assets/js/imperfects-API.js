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

    loadOptions();
});