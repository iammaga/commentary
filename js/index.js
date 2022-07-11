$(document).ready(function() {

    function loadReviews(page = 1) {
        $.ajax({
            mathod: "GET",
            url: "/api/reviews?page=" + page,
            success: function(response) {
                if (response.status == 'success') {
                    prepareReviews(response.data.reviews) // [{author: {name: "afdasd"}, "comment": "Comasda sdasd", 'star': 3, up: 0, down: 0}, ...]
                    prepareShowMoreBtn(response.data.pagination) // 
                }
            },
            error: function(er) {
                console.error(er);
            }
        })
    };

    loadReviews();

    function prepareShowMoreBtn(pagination) {
        if (pagination.current_page < pagination.last_page) {
            $('#load-more').click(function() {
                loadReviews(parseInt(pagination.current_page) + 1);
            })
        } else {
            $('#load-more').hide();
        }
    }
})




function prepareReviews(data) {

    let reviews = $('.reviews');

    for (let review of data) {
        reviews.append(`
          <div class="block">
          <div class="flex">
              <div class="pad" style="padding: 12px">
                  <img src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png" alt="" width="80" heigh="80">
              </div>
              <div class="pad" style="width: 100%;">
                  <div class="flex">
                      <div class="user-info">
                          <p>${review.author.name}</p>
                      </div>
                      <span>${new Date(review.created).toISOString().slice(0, 10)}</span>
                  </div>
                  <i>${makeReviewsStars(review.star)}</i>

                  <div>
                      <p style="font-weight: bold; font-size: large;">Комментарий:</p>
                      <p>${review.comment}</p>
                  </div>
                  <div class="reactions">
                      <i class="fa-regular fa-thumbs-up text-2xl cursor-pointer" data-id='${review.id}'></i> <span class='up'>${review.up}</span>
                      <i class="fa-regular fa-thumbs-down text-2xl cursor-pointer" data-id='${review.id}'></i> <span class='down'>${review.down}</span>
                  </div>
              </div>
          </div>
      </div>
    `);
    }

    let likeIcons = $('.fa-thumbs-up');
    let dislikeIcons = $('.fa-thumbs-down');

    likeIcons.each((i, el) => {
        let id = $(el).data('id');
        let countElement = $(el).parent().children('.up').first();
        $(el).click(() => likeReview(id, countElement))
    })

    dislikeIcons.each((i, el) => {
        let id = $(el).data('id');
        let countElement = $(el).parent().children('.down').first();
        $(el).click(() => dislikeReview(id, countElement))
    })
}

function makeReviewsStars(starNumber) {
    let starsIcons = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= starNumber) {
            starsIcons += '<i class="fa-solid fa-star"></i>'
        } else {
            starsIcons += '<i class="fa-regular fa-star"></i>'
        }
    }

    return starsIcons;
}

function likeReview(id, countElement) {
    $.ajax({
        method: "POST",
        url: '/api/reviews/like',
        success: function(response) {
            if (response.data) {
                countElement.text(parseInt(countElement.text()) + 1);
            }
        },
        error: function(er) {
            alert("Error happend!")
        }
    })
}

function dislikeReview(id, downElement) {
    $.ajax({
        method: "POST",
        url: '/api/reviews/dislike',
        success: function(response) {
            if (response.data) {
                downElement.text(parseInt(downElement.text()) + 1);
            }
        },
        error: function(er) {
            alert("Error happend!")
        }
    })
}

$('#make-review-btn').click(function() {
    $('#review-form').show();
})

$(document).click((e) => {
    if (e.target.id == 'create-review-btn') {
        let name = $("input[name='name']").val()
        let star = $("input[name='star']").val()
        let comment = $("textarea[name='comment']").val()

        let data = {
            star: star,
            comment: comment,
            up: 0,
            down: 0,
            created: Date.now(),
            author: {
                name: name
            }
        }

        $.ajax({
            method: "POST",
            url: '/api/reviews',
            data: data,
            processData: false,
            success: function(response) {
                if (response.data.comment.trim() !== "") {
                    prepareReviews([data])
                    $('#review-form').hide();
                }
            }
        })

    }
})

$('#close-review-form').click(function() {
    $('#review-form').hide();
})