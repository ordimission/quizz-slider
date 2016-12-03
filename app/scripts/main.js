/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 $(document).ready(function () {
            var story = getQueryVariable("story");
            if (story==="undefined") {
                story = "evangile_deb";
            }
            storeOptions();
            
            $.getJSON("./resources/"+story+".json", getData)
                .done(navigate);
        });
 

var getData = function (result) {
    var items = [];

    
    var slidesToNavigate = organize(result.slide);

    $.each(slidesToNavigate, function (i, slide) {

        items.push("<li>");

        // image
        doImg(slide, items);
        // text
        doText(slide, items);
        // choice (showAnswer to be included in organize with action attribute)
        slide.showAnswer = true;
        doChoice(slide, items);
        // free text area
        doFree(slide, items);
        // text
        doComment(slide, items);

        items.push("<li>");
    });
    doFinale(items);
    $("<ul/>", {
        "class": "slides",
        html: items.join("")
    }).appendTo("#slider");
    $('#sendButton').on("click",onSendButtonClick);
    $("title").text(result.title);
};


var shuffle = function (sourceArray, targetSize) {
    var targetArray = [];
    for (var i = 0; i < targetSize; i++) {
        targetArray.push(sourceArray[i]);
    }
    for (var i = targetSize; i < sourceArray.length; i++) {
        var j = Math.floor((Math.random() * i));
        if (j < targetSize) {
            targetArray[j] = sourceArray[i];
        }
    }
    return targetArray;
}


var organize = function(slides) {
    var options = JSON.parse(localStorage.getItem('options'));
    var slidesToReturn = slides;
    if (options.order === "false") {
        if (options.select === "all") {
            slidesToReturn = shuffle(slides, slides.length);
        } else {
            slidesToReturn = shuffle(slides, parseInt(options.select, 10));
        }
    }
    return slidesToReturn;
}

var doImg = function (slide, items) {
    if (typeof slide.img !== "undefined") {
        items.push("<img src='" + slide.img.src + "'></img>");
    }
}

var doText = function (slide, items) {
    if (typeof slide.text !== "undefined") {
        if (Array.isArray(slide.text)) {
            $.each(slide.text, function (j, paragraph) {
                items.push("<p>" + paragraph + "</p>");
            });
        } else {
            items.push("<p>" + slide.text + "</p>");
        }
    }
}

var doChoice = function (slide, items) {
    var options = JSON.parse(localStorage.getItem('options'));

    if (typeof slide.choice !== "undefined") {
        items.push("<div class='form-group'>");
        $.each(slide.choice, function (j, ch) {
            if (options.mode === "learning" || slide.showAnswer) {
                if (ch.answer === "true") {
                    items.push("<p><input type='checkbox' checked='true' class='form-control' />&nbsp;");
                } else {
                    items.push("<p><input type='checkbox' class='form-control' />&nbsp;");
                }
            } else {
                items.push("<p><input type='checkbox' class='form-control'/>&nbsp;");
            }
            items.push(ch.text);
            items.push("</p>")
        });
        items.push("</div>");
    }
}

var doFree = function (slide, items) {
    if (typeof slide.free !== "undefined") {
        items.push("<div class='form-group'>");
        $.each(slide.free, function (j, f) {
            items.push("<p>");
            items.push(f.text);
            items.push("</p><p><textarea class='form-control' rows='4'  /></p>");
        });
        items.push("</div>");
    }
}

var doComment = function (slide, items) {
    var options = JSON.parse(localStorage.getItem('options'));
    if (options.mode === "learning" && typeof slide.comment !== "undefined") {
        items.push("<p>" + slide.comment + "</p>");
    }
}

var doFinale = function (items) {
    var options = JSON.parse(localStorage.getItem('options'));
    if (options.mode !== "reading") {
        items.push("<li>");
        items.push("<div class='form-group'><p><button type='button' class='btn btn-primary'><span class='glyphicon' aria-hidden='true'></span>Send</button></p></div>");
        items.push("</li>");
    }
}

var storeOptions = function () {
    var options = {};
    options.mode = getQueryVariable("mode");
    if (options.mode === "undefined") {
        options.mode = "exam";
    }
    options.select = getQueryVariable("select");
    if (options.select === "undefined") {
        options.select = "all";
    }
    options.order = getQueryVariable("order");
    if (options.order === "undefined") {
        options.order = "true";
    }
    var optionsToStore = JSON.stringify(options);

    localStorage.setItem('options', optionsToStore);

}

var getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return "undefined";

}

var onSendButtonClick = function(event) {
    alert("click event");
}

var navigate = function () {
    $('#carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        itemWidth: 210,
        itemMargin: 5,
        asNavFor: '#slider'
    });

    $('#slider').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: false,
        slideshow: false,
        sync: "#carousel",
        start: function (slider) {
            $('body').removeClass('loading');
        }
    })
};


