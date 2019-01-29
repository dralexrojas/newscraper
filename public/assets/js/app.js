$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();

  // Here we add a comment when the add comment button is clicked
  $('.add-comment-button').on('click', function(){
    console.log("In add comment handler");
    // Get _id of article whose comments we are adding to
    var articleId = $(this).data("id");

    // get the baseURL for either local host or  Heroku
    var baseURL = window.location.origin;

    // Get Form Data by Id
    var frmName = "form-add-" + articleId;
    var frm = $('#' + frmName);


    // use AJAX call to add the comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: frm.serialize(),
    })
    .done(function() {
    
      location.reload();
    });
    
    return false;

  });


  // delete a comment
  $('.delete-comment-button').on('click', function(){
    console.log("in delete comment logic");
    // Get the id of comment to be deleted
    var commentId = $(this).data("id");

    // get the baseURL for either local host or  Heroku
    var baseURL = window.location.origin;

    // AJAX call to delete a comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
    
      location.reload();
    });

    return false;

  });
  
});