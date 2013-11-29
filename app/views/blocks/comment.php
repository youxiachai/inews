<?php $author = $comment->user()->find_one(); ?>
<div class="comment" id="comment_<?php echo $comment->id; ?>" data-author="<?php echo $author->name; ?>" data-id="<?php echo $comment->id; ?>">
    <div class="identical">
        <a href="<?php echo url('/u/' . $author->id); ?>" class="user-<?php echo $author->isOK() ? 'ok' : 'not-ok' ?>">
            <img class="avatar" src="<?php echo \Helper\Html::gravatar($author->email, 30); ?>" />
            @<?php echo $author->name; ?>
        </a>
        <a href="#comment_<?php echo $comment->id ?>" class="identical-day"># <?php echo $comment->created_at; ?></a>
        <a href="#respond" class="reply">reply</a>
        <?php if (!empty($user) && $user->isAdmin()):?>
            <a href="javascript:;" class="delete admin-text">delete</a>
        <?php endif; ?>
    </div>
    <div class="typo-p"><?php echo Helper\Html::fromMarkdown($comment->text); ?></div>
</div>