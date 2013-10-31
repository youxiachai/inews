<?php

namespace Route;

use Helper\Html;
use Model\Model;
use Pagon\Route\Rest;
use Pagon\Url;
use Route\Web;
use Suin\RSSWriter\Channel;
use Suin\RSSWriter\Feed;
use Suin\RSSWriter\Item;

class Service extends Rest
{
    protected $type = 'xml';
    protected $data = '';

    public function before()
    {
        $this->app->loadOrm();
    }

    public function after()
    {
        $this->output->contentType($this->type);
        $this->output->write($this->data);
    }
}