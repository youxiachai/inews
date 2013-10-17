if ($('#comments').length > 0) {
  $('#comments .delete').click(function () {
    var comment = $(this).closest('.comment');

    if (!comment.data('id')) {
      console.error("No comment id found!");
      return;
    }

    if (!confirm('Delete comment anyway?')) {
      return;
    }

    $.ajax({
      type: "DELETE",
      url: "/api/comments/" + comment.data('id'),
      dataType: 'json'
    }).done(function (msg) {
        if (msg.result) {
          Essage.show({message: msg.message, status: "success"}, 1000);
          comment.remove();
        } else {
          Essage.show({message: msg.message, status: "error"}, 1000);
        }
      })
  });
}