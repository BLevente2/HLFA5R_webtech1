$(function() {
    $("#move-box").draggable();
    $("#move-box").resizable();

    $("button").button();

    $("#start-effect").on("click", function() {
        $("#move-box").effect("bounce", { times: 3 }, 800);
    });

    $("#toggle-box").on("click", function() {
        if ($("#move-box").is(":visible")) {
            $("#move-box").hide("fade", 400);
        } else {
            $("#move-box").show("fade", 400);
        }
    });

    $("#spinner-a").spinner({
        min: -100,
        max: 100,
        step: 1
    });

    var sliderValueSpan = $("#slider-b-value");

    $("#slider-b").slider({
        min: -100,
        max: 100,
        value: 0,
        slide: function(event, ui) {
            sliderValueSpan.text(ui.value);
        },
        change: function(event, ui) {
            sliderValueSpan.text(ui.value);
        }
    });

    sliderValueSpan.text($("#slider-b").slider("value"));

    $("#result-dialog").dialog({
        autoOpen: false,
        modal: false,
        minWidth: 260
    });

    $("#calc-form").on("submit", function(e) {
        e.preventDefault();

        var aVal = $("#spinner-a").spinner("value");
        var bVal = $("#slider-b").slider("value");
        var op = $("input[name='op']:checked").val();
        var valid = true;
        var result;

        if (aVal === null || isNaN(aVal)) {
            valid = false;
        }
        if (bVal === null || isNaN(bVal)) {
            valid = false;
        }
        if (op === "div" && bVal === 0) {
            valid = false;
        }

        if (!valid) {
            $("#result-dialog").text("Hibás vagy hiányzó adatok.");
            $("#result-dialog").dialog("option", "title", "Hiba");
            $("#result-dialog").dialog("open");
            return;
        }

        if (op === "add") {
            result = aVal + bVal;
        } else if (op === "sub") {
            result = aVal - bVal;
        } else if (op === "mul") {
            result = aVal * bVal;
        } else if (op === "div") {
            result = aVal / bVal;
        } else {
            valid = false;
        }

        if (!valid) {
            $("#result-dialog").text("Ismeretlen művelet.");
            $("#result-dialog").dialog("option", "title", "Hiba");
        } else {
            $("#result-dialog").text("Az eredmény: " + result);
            $("#result-dialog").dialog("option", "title", "Eredmény");
        }

        $("#result-dialog").dialog("open");
    });
});