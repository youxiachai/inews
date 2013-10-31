<?php

namespace Route\Web;

use Model\Model;
use Route\Web;
use Helper\Html;

class Index extends Web
{
    protected $tpl = 'index.php';

    public function get()
    {
        if (($page = $this->input->query('page', 1)) < 1) $page = 1;
        $limit = 20;
        $offset = ($page - 1) * $limit;

        $total = Model::factory('Article')->where('status', '1')->count();

        $this->data['articles'] = Model::factory('Article')->where('status', '1')->order_by_desc('point')->offset($offset)->limit($limit)->find_many();
        $this->data['latest_articles'] = array();

        /**
         * 第一页加载最新的几篇文章
         */
        if ($page == 1) {
            $this->data['latest_articles'] = Model::factory('Article')->where('status', '1')->order_by_desc('created_at')->limit(5)->find_many();

            if ($this->data['latest_articles'] && !$this->input->query('force_latest')) {
                $exists_articles_ids = array();
                foreach ($this->data['articles'] as $article) {
                    $exists_articles_ids[] = $article->id;
                }

                $this->data['latest_articles'] = array_filter($this->data['latest_articles'], function ($article) use ($exists_articles_ids) {
                    if (in_array($article->id, $exists_articles_ids)) return false;
                    return true;
                });
            }
        }

        $this->data['page'] = Html::makePage($this->input->uri(), 'page=(:num)', $page, $total, $limit);
    }
}