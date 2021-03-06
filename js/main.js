function load(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode != '13') {
        return false;
    }

    var input = document.getElementById('input').value;
    input = input.trim();

    var regex = new RegExp(/(https?:\/\/www\.)?instagram\.com/);

    if (!input.match(regex)) {
        return alert('Invalid instagram url.');
    }

    $('#input').addClass('disabled');
    $('#loader').css('display', 'block');
    $('#preview').html('');
    $('#preview').css('display', 'none');

    try {
        $.ajax({
            type: 'GET',
            url: input,
            success: function (data) {
                data = JSON.parse(data.split("window._sharedData = ")[1].split(";</script>")[0]).entry_data.PostPage;
               

                if (data[0].graphql.shortcode_media.edge_sidecar_to_children !== undefined) {
                    $.each(data[0].graphql.shortcode_media.edge_sidecar_to_children.edges, function (i, val) {
                        if (val.node.is_video == true) {
                            var img_video_url = val.node.video_url + '&dl=1';
                        } else {
                            var img_video_url = val.node.display_url + '&dl=1';
                        }

                        const div = $('<div>');

                        div.attr('load_lazy', val.node.display_url);
                        div.html('<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><a href="' + img_video_url + '" target="_blank"></a>');
                        div.appendTo('#preview');
                    });
                } else {
                    if (data[0].graphql.shortcode_media.is_video == true) {
                        var img_video_url = data[0].graphql.shortcode_media.video_url + '&dl=1';
                    } else {
                        var img_video_url = data[0].graphql.shortcode_media.display_url + '&dl=1';
                    }

                    const div = $('<div>');

                    div.attr('load_lazy', data[0].graphql.shortcode_media.display_url);
                    div.html('<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><a href="' + img_video_url + '" target="_blank"></a>');
                    div.appendTo('#preview');
                }
                
                loadLazy();
            },
            error: function (xhr) {
                alert('Ajax Error: ' + xhr.statusText + '.');
            },
            complete: function () {
                $('#input').removeClass('disabled');
                $('#loader').css('display', 'none');
                $('#preview').css('display', 'flex');
            }
        });
    } catch (error) {
        alert(error);
    }
};

function loadLazy() {
    try {
        $("div[load_lazy]").each(function () {
            var this_ = $(this);
            var tmpImg = new Image();
            tmpImg.src = this_.attr('load_lazy');

            tmpImg.onload = function () {
                this_.find('.lds-roller').remove();
                this_.find('a').append(tmpImg);
            }
            tmpImg.onerror = function () {
                console.log($(this).attr("src") + " - image error.");
            }
            tmpImg.onAbort = function () {
                console.log($(this).attr("src") + " - image aborted.");
            }
        });
    } catch (error) {
        alert(error);
    }
}