$(function() {
  $(".intro-nav li").on("click", function() {
    $(".desc-item").hide();
    $(".intro-nav li").removeClass("actived");
    $(this).addClass("actived");
    $($(this).data("target")).show();
  });
});
