<?php

namespace Route\Service;

use Helper\Html;
use Model\Model;
use Pagon\Url;
use Route\Service;
use Route\Web;
use Suin\RSSWriter\Channel;
use Suin\RSSWriter\Feed as FeedFactory;
use Suin\RSSWriter\Item;

class Feed extends Service
{
    public function get()
    {
        $posts = Model::factory('Article')->where('status', '1')->order_by_desc('point')->limit(10)->find_many();

        $feed = new FeedFactory();

        $channel = new Channel();
        $channel
            ->title(config('site.title'))
            ->description(config('site.default_meta'))
            ->url(Url::site())
            ->appendTo($feed);

        foreach ($posts as $post) {
            $item = new Item();
            /** @var $post \Model\Article */
            $item
                ->title($post->title)
                ->description(Html::fromMarkdown($post->content))
                ->url($post->permalink())
                ->pubDate(strtotime($post->created_at))
                ->appendTo($channel);
        }

        $this->data = substr($feed, 0, -1);
    }
}