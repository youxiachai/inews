<article class="typo wrapper-padding up hover">

    <h2 class="title"><?php echo $article->title; ?>
        <small class="up-content">
            <span class="btn-up font font-thumbs-up <?php echo $user && $article->isDiggBy($user->id) ? 'on' : '' ?>"
                  data-id="<?php echo $article->id ?>"
                  data-user="<?php echo $user ? $user->id : ''; ?>"></span>
            (<cite class="up-count"><?php echo $article->digg_count ?></cite>)
        </small>
    </h2>

    <div class="entry">
        <div class="typo-p">
            <?php echo Helper\Html::fromMarkdown($article->content); ?>
        </div>

        <?php if($article->link): ?>
            <?php include('embed.php'); ?>
            <p class="ref">
                <a href="<?php echo url($article->link); ?>" target="_blank"><i class="font font-link"></i> REF <?php echo $article->link; ?></a>
            </p>
        <?php endif; ?>

        <?php $article_au = $article->author()->find_one(); ?>
        <div class="identical">
            <img class="avatar" src="<?php echo \Helper\Html::gravatar($article_au->email, 30); ?>" />
            created by <a href="<?php echo url('/u/' . $article_au->id); ?>"><?php echo $article_au->name ?></a> @
            <small><?php echo $article->created_at; ?></small>
        </div>

		<script type="text/javascript" charset="utf-8">
		(function(){
		  var img = document.querySelector('.entry .typo-p img');
		  var _w = 106 , _h = 58;
		  var param = {
			url:location.href,
			type:'5',
			count:'1',
			appkey:'',
			title:'<?php echo \Helper\Html::makeShareText($article); ?>',
			pic: img ? img.src : '',
			ralateUid:'',
			language:'zh_cn',
			rnd:new Date().valueOf()
		  }
		  var temp = [];
		  for( var p in param ){
			temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
		  }
		  document.write('<iframe allowTransparency="true" style="float:right;" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="'+ _w+'" height="'+_h+'"></iframe>')
		})()
		</script>

        <?php if($user && ($user->name == $article_au->name || $user->isAdmin())): ?>
        <div class="typo-p">
            <a class="tag" href="<?php echo url('/p/' . $article->id . '/destroy'); ?>">delete</a>
            <a class="tag tag-ok" href="<?php echo url('/p/' . $article->id . '/edit'); ?>">edit</a>
        </div>
        <?php endif; ?>
    </div>

    <div id="respond">
        <h3>Post a response: </h3>
        <form action="<?php echo url('/p/' . $article->id . '/comment'); ?>" method="POST">
            <?php if (!$user): ?>
            <textarea name="text" required="required" rows="3" class="typo-p" disabled placeholder="Plz login to comment"></textarea>
            <a class="btn" href="<?php echo url('/account/login'); ?>">Login/Register to share</a>
            <?php elseif (!$user->isOK()): ?>
            <textarea name="text" required="required" rows="3" class="typo-p" disabled placeholder="Can not share mind, your account is not ok."></textarea>
            <button class="btn btn-grey">Can not comment</button>
            <?php else: ?>
            <input type="submit" class="btn" value="Share my mind" /> <small><a href="http://wowubuntu.com/markdown/" target="_blank">Markdown syntax is supported</a></small>
            <?php endif; ?>
        </form>
    </div>

    <div id="comments">
        <?php foreach ($comments as $comment): ?>
            <?php $author = $comment->user()->find_one(); ?>
            <div class="comment" data-author="<?php echo $author->name; ?>" data-id="<?php echo $comment->id; ?>">
                <div class="identical">
                    <a href="<?php echo url('/u/' . $author->id); ?>" class="user-<?php echo $author->isOK() ? 'ok' : 'not-ok' ?>">
                        <img class="avatar" src="<?php echo \Helper\Html::gravatar($author->email, 30); ?>" />
                        @<?php echo $author->name; ?>
                    </a>
                    <a href="#comment_<?php echo $comment->id ?>" class="identical-day"># <?php echo $comment->created_at; ?></a>
                    <a href="#respond" class="reply">reply</a>
                    <?php if ($user && $user->isAdmin()):?>
                    <a href="javascript:;" class="delete admin-text">delete</a>
                    <?php endif; ?>
                </div>
                <div class="typo-p"><?php echo Helper\Html::fromMarkdown($comment->text); ?></div>
            </div>
        <?php endforeach;?>
    </div>
</article>
