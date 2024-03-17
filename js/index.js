const GALLERY_MAX = 11;

// Util: random shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// on document ready
$(function() {

  // load gallery images
  $.getJSON( "images/gallery/gallery.json", function(data) {

    let images = Array();
    $.each(data, function(series_key, series) {
      $.each(series.Images, function(image_key, image) {
        image.Series = series.Series;
        images.push(image);
      });
    });

    // Shuffle the images array
    shuffleArray(images);

    // images = shuffle(images);
    for (let i = 0; i < Math.min(images.length, GALLERY_MAX); i++) {

      // get image info from array
      let info = images[i];

      // generate new element from template
      let new_box = $($("#tmp-gallery-box").html())
        .addClass(`colors-${info.Colors}`);

      // insert text
      new_box.find(".gallery-sub").text(info.Series);
      new_box.find(".gallery-title").text(info.Title);

      // insert image
      let img_path = `images/gallery/${info.File}`;
      new_box.find(".gallery-img").css("background-image", `url(${img_path})`);

      // insert link and lightbox descriptions
      new_box.find("a").attr({
        href: img_path,
        "data-title": `"${info.Title}"`,
        "data-description": `aus der Serie "${info.Series}"`
      });

      // add to gallery
      new_box.appendTo("#gallery");

    }

    // remove template from DOM
    $("#tmp-gallery-box").remove();

    // add lightbox
    const lightbox = GLightbox({selector: ".gallery-box a", zoomable: false});

    // add ScrollReveal to gallery
    ScrollReveal({ reset: true }).reveal('.gallery-img');

  });

});
