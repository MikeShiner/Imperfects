$(document).ready(function () {


    var loadOptions = function () {
        $.get("localhost:3000/api", function (data) {
            console.log(data);
        });
    }
});