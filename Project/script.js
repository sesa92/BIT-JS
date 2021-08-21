const input = $('input');
const errorElement = $('.alert');
const url = "http://api.tvmaze.com/search/shows?q=";
const cardHolder = $(".cardHolder");
const backBtn = $('#btn');
const list = [];

const $nameMovie = $("#movieName");
const $img = $('#img');
const $listOfSeasons = $('#listSeasons');
const $listCast = $('#listCast');
const $showDetails = $('#showDetails');


$(document).ready(function () {
    get50();
});

const get50 = () => {
    $.ajax({
        url: "http://api.tvmaze.com/shows?q=",
        method: 'GET',
    }).done(response => {
        // console.log(response)
        cardHolder.html("");
        if (response.length == 0) {
            errorElement.text("No results");
            return;
        };
    response.sort((a, b) => {
        return b.rating.average - a.rating.average
    });
    for (var i = 0; i < 50; i++) {
        list.push(response[i]);
    };
        list.forEach((item) => {
            let card = $(
            `<div class='col-4'>
            <div class= 'card'>
            <img src='${item.image.original}'>
            <div class='card-body'>
            <h6 class='card-title' id='${item.id}'>${item.name}</h6>
            </div>
            </div>
            </div>`);
            cardHolder.append(card);
        });
    }).fail(() => {
        errorElement.text("Network error!");
        errorElement.toggle();
    });
};

const search = inputValue => {
    $.ajax({
        url: `${url}${inputValue}`,
        method: 'GET'
    }).done(response => {
        // console.log(response);
        cardHolder.html("");
        if (response.length == 0) {
            errorElement.text("No results");
            return;
        };
        response.forEach(item => {
            //console.log(item.show.id);
            var card = $(
            `<div class='col-4'>
            <div class= 'card'>
            <img src='${item.show.image.original}'>
            <div class='card-body'>
            <h6 class='card-title' id='${item.show.id}'> ${item.show.name}</h6>
            </div>
            </div>
            </div>`);
            cardHolder.append(card);
        });

    }).fail(() => {
        errorElement.text("Network error!");
        errorElement.toggle();
    });   
};

const searchHandler = event => {
    if (event.keyCode == 13) {
        var inputValue = input.val();
        input.blur();
        if (!inputValue) {
            errorElement.text("Input is required");
            errorElement.toggle();
            return;
        };
        search(inputValue);
    };
};


const clearInput = () => {
    input.val("");
    errorElement.text("");
    errorElement.css("display", "none");
};

input.on("keydown", searchHandler);
input.on("focus", clearInput);


const showBack = () => {
    $(".cardHolder").show();
    $(".singleMovie").hide();
};

backBtn.on("click", goBack = () => window.location.href = "index.html");

$(document).ready(() => {
    $('.cardHolder').on('click', function getInfo(e) {
        if (e.target.className == 'card-title') {
            //window.open('show_info_page.html');
            //window.close('index.html');
            //window.location.href = 'show_info_page.html';

            var showId = e.target.getAttribute('id');

            $(".cardHolder").hide();
            $(".singleMovie").show();
            getShow(showId);
            getSeasons(showId);
            getCast(showId);
            return false;
        };
    });
    
    const getShow = id => {
        let request = $.ajax({
            url: "http://api.tvmaze.com/shows/" + id,
            method: "GET",
        });

        request.done(response => { 
            // console.log(response);
            $nameMovie.text(response.name)
            $img.attr('src', response.image.original);
            $showDetails.append(`${response.summary}`);  
        });
    };

    const getSeasons = id => {
        let request = $.ajax({
            url: "http://api.tvmaze.com/shows/" + id + '/seasons',
            method: "GET",
          });
          request.done(response => {
            $("h3.seasons").text(`Seasons : (${response.length})`);
            response.forEach( e => {
                $listOfSeasons.append(`<li>${e.premiereDate}  -  ${e.endDate}</li>`)
            }); 
        });
    };

    const getCast = id => {
        let request = $.ajax({
            url: "http://api.tvmaze.com/shows/" + id + '/cast',
            method: "GET",
          });
          request.done(response => {
            //console.log(response);
            $("h3.cast").text(`Cast`);
            let isNotFullCast = true;
            response.forEach((e,i) => {
                // console.log(e, i);
               if (isNotFullCast) {
                $listCast.append(`<li>${e.person.name}  as  ${e.character.name}</li>`)
                    if (i >= 8) {
                    isNotFullCast = false;
                    };
                };
            });  
        });
    };
});

