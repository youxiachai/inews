<?php

namespace Route\Api;

use Model\Article;
use Route\Api;
use Model\Model;
use ORM;

class Comment extends Api
{
    protected $auth = true;

    public function delete()
    {
        $comment = Model::factory('Comment')->find_one($this->params['id']);

        if (!$comment) {
            $this->error('Comment not exists');
        }

        $article = Model::factory('Article')->find_one($comment->article_id);

        try {
            ORM::get_db()->beginTransaction();

            if (!$comment->delete()) {
                $this->error('Comment delete fail');
            }

            if ($article) {
                $article->set_expr('comments_count', '`comments_count` + 1');
                $article->save();
            }
            ORM::get_db()->commit();
        } catch (\PDOException $e) {
            ORM::get_db()->rollBack();
            $this->error('Comment delete error');
        }

        $this->ok('Comment delete ok');
    }
}