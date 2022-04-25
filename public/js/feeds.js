$('.like-button').click(function (e) {
    e.preventDefault();
    let targetUrl = $(this).attr('href');

    if (this.classList.contains('liked')) {
        this.classList.add('not-liked');
        this.classList.remove('liked');
        targetUrl = '/unlike' + targetUrl;
        $.ajax({
            url: targetUrl,
            type: 'GET',
            success: function () {
                console.log('Unliked');
                window.location.reload();
            },
            error: function (err) {
                console.log(err.status);
            }
        });
    }
    else {
        this.classList.add('liked');
        this.classList.remove('not-liked');
        targetUrl = '/like' + targetUrl;
        $.ajax({
            url: targetUrl,
            type: 'GET',
            success: function () {
                console.log('Liked');
                window.location.reload();
            },
            error: function (err) {
                console.log(err.status);
            }
        });
    }
})

$('.bookmark-button').click(function (e) {
    e.preventDefault();
    let targetUrl = $(this).attr('href');
    if (this.classList.contains('bookmarked')) {
        this.classList.add('not-bookmarked');
        this.classList.remove('bookmarked');
        targetUrl = '/unbookmark' + targetUrl;
        $.ajax({
            url: targetUrl,
            type: 'GET',
            success: function () {
                console.log('Unbookmarked');
                window.location.reload();
            },
            error: function (err) {
                console.log(err.status);
            }
        });
    }
    else {
        this.classList.add('bookmarked');
        this.classList.remove('not-bookmarked');
        targetUrl = '/bookmark' + targetUrl;
        $.ajax({
            url: targetUrl,
            type: 'GET',
            success: function () {
                console.log('Bookmarked');
                window.location.reload();
            },
            error: function (err) {
                console.log(err.status);
            }
        });
    }
});


