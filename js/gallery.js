// list of built sets
var sets_built = [];
var sets_json = [];
var lightboxes = [];

// open a set gallery
function open_set() {

  // calling element and set id
  el = $(this)
  set_id = "set-" + el.data("set");

  // update slider
  $("#gallery-slider").find("a").removeClass("active-set");
  el.addClass("active-set");

  // hide all sets
  $(".gallery-set").hide();

  // check if set already built
  if (!sets_built.includes(el.data("set"))) {

    // get information from json
    set = sets_json[el.data("set")];

    // generate new element from template and set id
    let new_set = $($("#tmp-gallery-set").html()).attr("id", set_id);

    // set title and description
    new_set.find(".gallery-set-title").text(set.Series);
    new_set.find(".gallery-set-description").text(set.Description);
 
    // add images to set gallery
    set.Images.forEach(function(image) {

      // generate new image element from template and set id
      let new_image_set = $($("#tmp-gallery-set-box").html());
      let filepath = `images/gallery/${image.File}`;
      let filepath_thumbnail = `images/gallery/thumbnails/${image.File}`;
      new_image_set.find(".img-box").attr("src", filepath_thumbnail);

      // insert link and lightbox descriptions
      new_image_set.attr({
        href: filepath,
        "data-title": `"${image.Title}"`,
        "data-description": `aus der Serie "${set.Series}"`
      });

      // append image to gallery
      new_set.find(".gallery-set-main").append(new_image_set);
  
    });

    // add set gallery
    new_set.appendTo("main");

    // add lightbox
    let lightbox = GLightbox({selector: `#${set_id} a`, zoomable: false});
    lightboxes.push(lightbox);

    // mark set as built
    sets_built.push(el.data("set"));

    // check for overflow
    var el_main = document.querySelector(`#${set_id}`);
    console.log(el_main.offsetHeight + "/" + el_main.scrollHeight);
    if (el_main.offsetHeight < el_main.scrollHeight) {
      alert("Overflow!");
    } else {
    }

  } else {

    // show set already built
    $("#" + set_id).show();

  }

}

// on document ready
$(function() {

  // load gallery images
  $.getJSON( "images/gallery/gallery.json", function(data) {

    // Extract first image of each series
    let sets = Array();
    $.each(data, function(series_key, series) {
      series.Key = series_key;
      series.Image = series.Images[0];
      sets.push(series);
    });

    // store json information
    sets_json = sets;

    // images = shuffle(images);
    for (let i = sets.length - 1; i >= 0; i--) {

      // get image info from array
      let info = sets[i];

      // generate new element from template
      let new_box = $($("#tmp-gallery-nav-box").html())

      // insert thumbnail image (thumbnails folder and always .jpg)
      let img_path = `images/gallery/thumbnails/${info.Image.File}`;
      new_box.find(".gallery-nav-img").css("background-image", `url(${img_path})`);

      // insert title
      new_box.find(".gallery-nav-title").text(info.Series);

      // bind data
      new_box.find("a").data("set", i);
      new_box.find("a").click(open_set);

      // add to gallery
      new_box.appendTo("#gallery-slider");

    }

    // remove template from DOM
    $("#tmp-gallery-nav-box").remove();

  });

});
