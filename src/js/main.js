"use strict"

$(document).ready(function () {
    var $library = $(".library_wr"),
        gallery_items_txt = '.timeline_slider_wr .timeline_slide .in',
        $gallery_items = $(gallery_items_txt),
        $add_slide_zone = $(".timeline_slider_wr .timeline_add_slide"),
        drop_active_class = 'ui-state-highlight',
        slideshow_params = {
            autoplay: false,
            autoplaySpeed: 1000,
            dots: false,
            asNavFor: $('.timeline_slider'),
            prevArrow: $('.slideshow_slider_wr .slider_arrow_prev'),
            nextArrow: $('.slideshow_slider_wr .slider_arrow_next'),
            fade: false,
            infinite: false,
            speed: 400,
            pauseOnHover: false,
            pauseOnDotsHover: false,
            initialSlide: 0
        },
        timeline_params = {
            slidesToShow: 10,
            centerMode: false,
            focusOnSelect: true,
            variableWidth: false,
            autoplay: false,
            autoplaySpeed: 1000,
            dots: false,
            asNavFor: $('.slideshow_slider'),
            prevArrow: $('.timeline_slider_wr .slider_arrow_prev'),
            nextArrow: $('.timeline_slider_wr .slider_arrow_next'),
            fade: false,
            infinite: false,
            pauseOnHover: false,
            pauseOnDotsHover: false,
            speed: 400
        },
        timeline_slide_txt = '<div class="timeline_slide"><div class="remove_slide" title="remove slot"><i class="fa fa-times" aria-hidden="true"></i></div><div class="in"></div></div>',
        slideshow_slide_txt = '<div class="slideshow_slide"></div>';

    $('.slider_param_speed').val(slideshow_params.autoplaySpeed);
    $('.slider_param_step_duration').val(slideshow_params.speed);

    $('.slideshow_slider').slick(slideshow_params);
    $('.timeline_slider').slick(timeline_params);
    $('.slideshow_slider').on('afterChange', function (event, slick, current_slide) {
        slideshow_params.initialSlide = current_slide;
        //slick bug
        $('.timeline_slider .timeline_slide').removeClass('slick-current');
        $('.timeline_slider .timeline_slide').eq(current_slide).addClass('slick-current');
    });

    $('.slideshow_play').click(function () {
        $('.slideshow_slider').slick('slickPlay');
        slideshow_params.autoplay = true;
    });
    $('.slideshow_stop').click(function () {
        $('.slideshow_slider').slick('slickPause');
        slideshow_params.autoplay = false;
    });


    /* DRAG'N'DROP */

    // let the gallery items be draggable
    function reinitDraggable() {
        $(".library_item", $library).draggable({
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document",
            helper: "clone",
            cursor: "move"
        });
    };
    reinitDraggable();

    // let the gallery be droppable, accepting the library items
    function reinitDroppable(elements) {
        var element_to_init = elements || $gallery_items;
        element_to_init.each(function () {
            var $current_gallery = $(this);

            $current_gallery.droppable({
                accept: ".library_wr .library_item",
                activeClass: drop_active_class,
                drop: function (event, ui) {
                    addImgToGallerySlot(ui.draggable, $current_gallery);
                    $('.' + drop_active_class).removeClass(drop_active_class);
                }
            });
        });
    }
    reinitDroppable();

    $add_slide_zone.droppable({
        accept: ".library_wr .library_item",
        activeClass: drop_active_class,
        drop: function (event, ui) {
            var timeline_slide = $(timeline_slide_txt).find('.in').append(ui.draggable.find('img').attr('draggable', 'false').clone()).end(),
                slideshow_slide = $(slideshow_slide_txt).append(ui.draggable.find('img'));
            ui.draggable.remove();

            timeline_slide.find('.remove_slide').click(onRemoveSlideClick);
            timeline_slide.on('contextmenu', deleteImdFromSlide);

            $('.slideshow_slider').slick('slickAdd', slideshow_slide);
            $('.timeline_slider').slick('slickAdd', timeline_slide);
            $('.' + drop_active_class).removeClass(drop_active_class);
            reinitDraggable();
            reinitDroppable($(gallery_items_txt));
        }
    });

    function addImgToGallerySlot(item, slide) {
        var big_slide = big_slide = $('.slideshow_slide').eq(slide.parent().index()),
            img = (item.find('img'))? item.find('img'): item;

        if (slide.find('img').length) {
            addImgToLibrary(slide.find('img'), $library);
        }

        big_slide.find('img').remove().end().append(img.clone());
        img.appendTo(slide).end().end().remove();
    }

    function addImgToLibrary(img, library) {
        var $content = $('<div class="library_item"></div>').append($('<div class="in"></div>')).find('.in').append(img).end();

        library.append($content);
        reinitDraggable();
    }

    function findSlickIndex(selector, index_in_parent) {
        return $(selector).eq(index_in_parent).data('slick-index');
    }

    function deleteImdFromSlide(event) {
        var big_slide = $('.slideshow_slide').eq($(this).index()),
            img = $(this).find('img');
        if (img.length) {
            big_slide.find('img').remove();
            addImgToLibrary(img, $library);
        }
        event.preventDefault();
    }

    $('.timeline_slide').on('contextmenu', deleteImdFromSlide);


    function onRemoveSlideClick(event) {
        var tab_index = $(this).parent().data('slick-index'),
            $big_slide_index = findSlickIndex('.slideshow_slide', $(this).parent().index()),
            img = $(this).parent().find('img'),
            i = 0;

        if (img.length) {
            addImgToLibrary(img, $library);
        }

        $('.slideshow_slider').slick('slickRemove', $big_slide_index);
        $('.timeline_slider').slick('slickRemove', tab_index);

        i = 0;
        $('.slideshow_slider .slideshow_slide').each(function () {
            $(this).attr("data-slick-index", i);
            i++;
        });
        i = 0;
        $('.timeline_slider .timeline_slide').each(function () {
            $(this).attr("data-slick-index", i);
            i++;
        });
    }

    $('.timeline_slide .remove_slide').click(onRemoveSlideClick);

    // Upload files
    var $uploadZone = $('.upload_zone');

    if (typeof (window.FileReader) == 'undefined') {
        $uploadZone.text('Не поддерживается браузером!');
        $uploadZone.addClass('error');
    }

    $(document).on('dragover', function (event) {
        $uploadZone.addClass('hover');

        event.preventDefault();
        event.stopPropagation();
    });

    $(document).on('dragleave', function () {
        $uploadZone.removeClass('hover');

        event.preventDefault();
        event.stopPropagation();
    });

    $(document).on('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $uploadZone.on('drop', function (event) {
        event.originalEvent.dataTransfer.dropEffect = 'copy';
        var files = event.originalEvent.dataTransfer.files,
            i;

        event.preventDefault();
        event.stopPropagation();

        function addFile(file) {
            var fileReader = new FileReader();
            fileReader.onload = (function (file) {
                return function (e) {
                    $uploadZone.append('<div class="library_item"><div class="in"><img src="' + e.target.result + '"></div></div>');
                    reinitDraggable();
                }
            })(file);
            fileReader.readAsDataURL(file);
        }

        if (files) {
            for (i = 0; i < files.length; ++i) {
                addFile(files[i]);
            }
        }

        $uploadZone.removeClass('hover');
        $uploadZone.addClass('drop');
    });

    // change slider params
    $('.slider_param_speed').change(function () {
        var value = parseInt($(this).val(), 10);

        value = (value >= 400) ? value : slideshow_params.autoplaySpeed;

        $('.slideshow_slider').slick('slickPause').slick('slickSetOption', 'autoplaySpeed', value, false).slick('slickPlay');
        slideshow_params.autoplaySpeed = value;
        $(this).val(value);
    });

    $('.slider_param_step_duration').change(function () {
        var value = parseInt($(this).val(), 10);

        value = (value >= 200) ? value : slideshow_params.speed;

        $('.slideshow_slider').slick('slickPause');
        $('.slideshow_slider').slick('slickSetOption', 'speed', value, false);
        $('.slideshow_slider').slick('slickPlay');
        slideshow_params.speed = value;
        $(this).val(value);
    });

    $('.slider_param_fade').change(function () {

        if ($(this).is(':checked')) {
            slideshow_params.fade = true;
        } else {
            slideshow_params.fade = false;
        }
        $('.slideshow_slider').slick('unslick');
        $('.slideshow_slider').slick(slideshow_params);
    });

    $('.slider_params').submit(function () {
        return false;
    });

    // localStorage
    function checkOnSavedImgs() {
        if (window.localStorage.length) {
            $('.download_params').removeClass('disabled');
        }
    }

    if (window.localStorage) {
        checkOnSavedImgs();
        $('.save_params').click(function () {
            window.localStorage.clear();
            try {
                $('.slideshow_slider .slideshow_slide').each(function () {
                    var img = $(this).find('img').get(0);
                    if (img) {
                        window.localStorage.setItem('img_' + $(this).data('slick-index'), img.src);
                    }
                });
            } catch (e) {
                alert('Ошибка сохранения файлов:\n ' + e.name + ":" + e.message + "\n" + e.stack);
            }
            checkOnSavedImgs();
        });
        $('.clear_params').click(function () {
            window.localStorage.clear();
            $('.download_params').addClass('disabled');
        });
    } else {
        $('.manage_buttons').remove();
    }

    $('.download_params').click(function () {
        var i, max, key, deficiency, img,
            slide,
            all_keys = [];
        if (!window.localStorage.length) {
            $(this).addClass('disabled');
            return false;
        }

        // return current imgs from slider to library
        $('.timeline_slide').trigger('contextmenu');

        for (i = 0, max = window.localStorage.length; i < max; ++i) {
            key = window.localStorage.key(i);
            if (key.indexOf('img_') === 0) {
                all_keys.push( { num: 1 + parseInt(key.slice(4), 10), val: key } );
            }
        }

        console.log(parseInt(key.slice(4), 10), all_keys);
        all_keys.sort(function (a, b) {
            return a.num - b.num;
        });
console.log(all_keys);
        deficiency = all_keys[all_keys.length - 1].num - $('.slideshow_slider .slideshow_slide').length;
console.log(deficiency, $('.slideshow_slider .slideshow_slide').length);
        for ( i = 0; i < deficiency; ++i) {
            $('.slideshow_slider').slick('slickAdd', slideshow_slide_txt);
            $('.timeline_slider').slick('slickAdd', timeline_slide_txt);
            $('.timeline_slider .timeline_slide').last()
                .on('contextmenu', deleteImdFromSlide)
                .find('.remove_slide').click(onRemoveSlideClick);
        }

        for( i = 0, max = all_keys.length; i < max; ++i ){
            console.log(all_keys[i].val);
            img = $('<img>');
            img.attr('src', window.localStorage.getItem(all_keys[i].val));

            $('.timeline_slider .timeline_slide').eq(all_keys[i].num - 1).find('.in').append($(img).clone());
            $('.slideshow_slider .slideshow_slide').eq(all_keys[i].num - 1).append($(img));

            //addImgToGallerySlot($(img), $('.timeline_slider .timeline_slide').eq(all_keys[i].num));
        }

        reinitDraggable();
        reinitDroppable($(gallery_items_txt));

        console.log('ind', all_keys);
    });
});
