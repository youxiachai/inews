$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

// digg
$.fn.digg = function () {

  // x, 这个 '.btn-up' 是 hardcore，jquery 不支持直接传 obj
  $(document).on('click', '.btn-up', function () {

    var id, action, data, self = $(this);

    // 让用户去登录
    if (!self.data('user')) return window.location.href = "/account/login";

    id = self.data('id');
    action = self.hasClass('on') ? 'cancel' : 'digg';
    data = {
      article_id: id,
      action: action
    };

    $.post('/api/digg', data).done(function (data) {
      if (!data.result) return alert(data.message || 'Process digg error!');

      var fn = self.hasClass('on') ? 'removeClass' : 'addClass';
      self[fn]('on');
      self.parent().find('.up-count').html(data['digg_count']);
    }).error(function () {
        alert('Can\'t send your request, Sorry guy!');
      });
  })

}

// repay
$.fn.reply = function () {
  var form = $('#respond')
    , reply;

  reply = function () {
    var cmt = $(this).closest('.comment')
      , au = cmt.data('author')
    //, id = cmt.data('id')
      , sel = document.getSelection() + ''
      , textarea = form.find('textarea')
      , text;

    sel = sel ? ('> QUOTE: ' + sel + '\n\n') : '';
    text = sel + '@' + au + ' ';

    cmt.append(form);

    textarea.val(text);
    textarea[0].selectionStart = text.length;
    textarea[0].selectionEnd = text.length;

    textarea.focus();

    return false;
  }

  this.on('click', '.reply', reply);
}


$.fn.notify = function () {

  var mark;

  mark = function (e) {
    var item = $(this)
      , id = item.data('id')
      , badge = $('#notice')
      , count = +badge.html();

    item.hasClass('on') && $.post('/api/notify/read', {id: id}).done(function () {
      item.removeClass('on');
      badge.html(--count);
    })
  }

  this.on('mouseenter', '.notify', mark)

}

$.fn.autoload = function () {

  var loading = false;
  var that = this;
  var canLoad = true;
  var page = 1;
  var load = function () {
    loading = true;
    $('#loading').show();
    $.get('/api/comments', {pid: json.pid, html: 1, page: page}, function (json) {
      if (!json.html) {
        canLoad = false;
      } else {
        page++;
        $('#loading').before(json.html);
      }
      $('#loading').hide();
      loading = false;
    })
  };

  $(this).append('<div id="loading" class="loading" style="display:none;">loading...</div>');
  load();

  $(window).scroll(function () {
    var top = $(this).scrollTop(), dheight = $(document).height(), wheight = $(window).height();

    if ((top / (dheight - wheight)) > 0.95 && canLoad && !loading) {
      load();
    }
  });

}

$.fn.create = function () {

  var that = this;
  var form = $('#respond form')

  form.submit(function (event) {
    var obj = $(this).serializeObject();
    if (!obj.text) return;
    obj.html = 1;
    form.find(':submit').val('Sending...');
    form.find('textarea').attr('disabled', true);
    $.post('/api/comments', obj, function (json) {
      Essage.show({message: json.message, status: json.error ? "error" : "success"}, 1000);
      if (!json.error && json.html) {
        form.find('textarea').val('');
        $(that).prepend(json.html);
      }
      form.find('textarea').removeAttr('disabled');
      form.find(':submit').val('Share my mind');
    });
    event.preventDefault();
  });
}

~function () {

  var Mouse, fn, mouse;

  Mouse = function () {
  };
  fn = Mouse.prototype;

  fn.is_article = function () {
    var reg = /^\/article\/(\d)+(.+)?/i
      , path = window.location.pathname;

    return reg.test(path) ? path.replace(reg, '$1') : null;
  }

  fn.help = function (e) {
    var modal = $('#modal-shortcut');
    if (!modal.length) return;
    modal.is(':visible') ? modal.modal('hide') : modal.modal('show');
  }

  fn.backtotop = function () {
    var hash = window.location.hash;
    window.location.hash = hash === '#header' ? '#' : 'header';
  }

  fn.share = function () {
    window.location = '/submit';
  }

  fn.latest = function () {
    window.location = '/latest';
  }

  fn.home = function () {
    window.location = '/';
  }

  fn.mark = function () {
    var mark = $('.markall');
    if (mark.length) mark.submit();
  }

  fn.prev = function (direction) {
    var id = fn.is_article();
    if (!id) return;
    id = direction === 1 ? ++id : --id;
    id = Math.max(id, 1);
    window.location = '/article/' + id;
  }

  fn.next = function () {
    fn.prev(1);
  }

  fn.boss = function () {
    var html = $('html');

    // firefox is not work, :sign
    html.is(':visible') ? html.hide('fast') : html.show('fast');
  }

  mouse = new Mouse();
  Mousetrap.bind(['?', 'esc'], mouse.help);
  Mousetrap.bind('t', mouse.backtotop);
  Mousetrap.bind('n', mouse.share);
  Mousetrap.bind('l', mouse.latest);
  Mousetrap.bind('left', mouse.prev);
  Mousetrap.bind('right', mouse.next);
  Mousetrap.bind('h', mouse.home);
  Mousetrap.bind('m', mouse.mark);
  Mousetrap.bind('b', mouse.boss);

}();

// video resize
~function () {
  $.fn.videoResize = function () {
    this.each(function () {
      $(this).height(parseInt($(this).width() * 0.78, 10));
    });
  }

  var $target = $('embed, object, iframe');

  $(function () {
    $target.videoResize()
  })
  $(window).resize(function () {
    $target.videoResize()
  });
}();

$(function () {

  // digg func
  $('.btn-up').digg();

  // form validator
  $('form').validator();

  // auto resize textarea
  $('textarea').autosize();

  if ($('#comments').length == 1) {

    // enable reply
    $('#comments').reply();

    // mark as read
    $('#comments').notify();

    $('#comments').create();

    // autoload comments
    json.robot || $('#comments').autoload();
  }
});