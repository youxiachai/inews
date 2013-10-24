<?php

return array(
    /**
     * 开始Debug模式
     */
    'debug'    => true,

    /**
     * 数据库配置
     */
    'database' => array(
        'type'     => 'mysql',
        'host'     => 'localhost',
        'port'     => '3306',
        'dbname'   => 'inews-community',
        'username' => 'root',
        'password' => '',
        'charset'  => 'utf8',
        'options'  => array()
    ),

    /**
     * 管理员列表，使用用户名
     */
    'admins'        => array(
        'admin', 'hfcorriez'
    ),
    'site_url' => '/index.php'
);