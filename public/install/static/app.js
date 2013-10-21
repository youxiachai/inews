if (!is_pass) {
  $('input').attr('disabled', true);
  Essage.show({message: 'Can not install before fix the check!', status: "error"});
} else {
  $('input').attr('disabled', false);
}

$('form').submit(function () {
  if (!confirm('Install...?')) return false;
});

$('#test').click(function () {
  $.post('/test', $('form').serializeArray(), function (msg) {
    if (msg.success) {
      Essage.show({message: msg.message, status: "success"}, 2000);
    } else {
      Essage.show({message: msg.message || 'Test connection error!', status: "error"}, 2000);
    }
  });
});