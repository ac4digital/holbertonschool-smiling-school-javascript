$( document ).ready(function() {
    // -------------Quotes Sections-------------
    // loading icon for quotes carousel
    const whileLoading = (on, id) => {
        if (on) {
            $(`${id}`).append(`
                <div class="loaderContainer d-flex align-items center">  
                    <div id="loading" class="d-flex spinner-border justify-content-center" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            `);
        } else {
            $(".loaderContainer").remove();
        }
    }
    // ------------- Quotes Sections -------------
    // Creates each carousel item of quotes
    const getQuotes = () => {
        let r = new XMLHttpRequest();
        whileLoading(1, "#carouselQuote");
        r.onload = function() {
             if (r.status >= 200 && r.status < 300) {
                let p = new DOMParser();
                let xmlDoc = p.parseFromString(r.response,"text/xml");
                for (let i = 0; i < xmlDoc.getElementsByTagName("quote").length; i++) {
                    $("#carouselInnerQuotes").append(`
                        <div class="carousel-item py-5 p-md-5">
                                <div class="item-inner d-md-flex flex-row">
                                    <img src="${xmlDoc.getElementsByTagName("pic_url")[i].textContent}" width="160px" height="160px" class="d-block mx-auto rounded-circle mr-2" alt="Author of the quote 2">
                                    <div class="carousel-caption d-md-block text-left">
                                        <p>${xmlDoc.getElementsByTagName("text")[i].textContent}</p>
                                        <p class="font-weight-bold">${xmlDoc.getElementsByTagName("name")[i].textContent}</p>
                                        <p class="font-italic">${xmlDoc.getElementsByTagName("title")[i].textContent}</p>
                                    </div>
                                </div>
                        </div> 
                    `)
                    if (i == 0) $("#carouselInnerQuotes .carousel-item").first().addClass("active");
                }
                whileLoading();
             }
        }
        r.open("GET", "https://smileschool-api.hbtn.info/xml/quotes")
        r.send();
    }
    // ------------- Video Carousel Sections -------------
    // Creates each slide with multiple carousel-items
    const cardSlider = (id) => {
        $(`#${id}`).carousel({
        interval: 10000
        })
        $(`.carousel #${id}-itemTutorial`).each(function(){
            let next = $(this).next();
            if (!next.length) next = $(this).siblings().first();
            next.children(':first-child').clone().appendTo($(this));
            
            for (let i = 0; i < 2; i++) {
                next = next.next();
                if (!next.length) next = $(this).siblings().first();
                next.children(':first-child').clone().appendTo($(this));
            }
        });

    };
    // Creates a carousel item for each tutorial card
    const makeTutorialCard = (URL, id) => {
        let r = new XMLHttpRequest();
        whileLoading(1, id);
        r.onload = function() {
             if (r.status >= 200 && r.status < 300) {
                let p = new DOMParser();
                let xmlDoc = p.parseFromString(r.response,"text/xml");
                for (let i = 0; i < xmlDoc.getElementsByTagName("video").length; i++) {
                    console.log(xmlDoc.getElementsByTagName("video")[i].getAttribute("id"))
                    $(`#${id}`).append(`
                        <div id="${id}-itemTutorial" class="carousel-item justify-content-center ${id}-card-${xmlDoc.getElementsByTagName("video")[i].getAttribute("id")}">
                            <div class="card border-0 mr-4 col-12 col-md-6 col-lg-4">
                                <img src="${xmlDoc.getElementsByTagName("thumb_url")[i].textContent}" class="card-img-top d-block img-fluid" alt="tutorial" width="255px" height="154px">
                                <img src="./images/play.png" class="position-absolute play-icon" width="64px" height="64px">
                                <div class="card-body">
                                    <div>
                                        <h6 class="font-weight-bold">${xmlDoc.getElementsByTagName("title")[i].textContent}</h6>
                                        <p class="card-text text-gray">${xmlDoc.getElementsByTagName("sub-title")[i].textContent}</p>
                                        <span class="d-flex flex-row">
                                            <img src="${xmlDoc.getElementsByTagName("author_pic_url")[i].textContent}" class="rounded-circle" alt="author pic" width="30px" height="30px">
                                            <p class="profile-video font-weight-bold ml-3">${xmlDoc.getElementsByTagName("author")[i].textContent}</p>
                                        </span>
                                    </div>
                                    <span class="d-flex flex-row justify-content-between">
                                        <span id="${id}-stars">
                                        </span>
                                        <p class="profile-video p-0 m-0">${xmlDoc.getElementsByTagName("duration")[i].textContent}</p>
                                    </span>
                                </div>  
                            </div>
                        </div> 
                    `)
                    for (let j = 0; j < xmlDoc.getElementsByTagName("video")[i].getAttribute("star"); j++)
                        $(`.${id}-card-${xmlDoc.getElementsByTagName("video")[i].getAttribute("id")} #${id}-stars`).append(`<img src="./images/star_on.png" alt="one full star" width="15px"></img>`);
                }
                $(`#${id}-itemTutorial`).first().addClass("active");
                cardSlider(id);
                whileLoading();
             }
        }
        r.open("GET", URL);
        r.send();
    };

    getQuotes();
    makeTutorialCard("https://smileschool-api.hbtn.info/xml/popular-tutorials", "innerVideos");
    makeTutorialCard("https://smileschool-api.hbtn.info/xml/latest-videos", "latestInner");
});