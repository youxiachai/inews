<?php

/** @var $app \Pagon\App */
$app = include __DIR__ . '/bootstrap.php';

$app->assisting();

$app->get('/', function ($req, $res) {
    $checked = array();

    if (preg_match('/PHP ([\w.]+) /', shell_exec('/usr/bin/env php -v'), $m)) {
        $PHP_VERSION_CLI = $m[1];
    } else {
        $PHP_VERSION_CLI = 'Not found';
    }

    $checked['PHP'] = array(
        'need'     => '5.3.9',
        'web'      => PHP_VERSION,
        'cli'      => $PHP_VERSION_CLI,
        'web_pass' => version_compare(PHP_VERSION, '5.3.9') >= 0,
        'cli_pass' => version_compare($PHP_VERSION_CLI, '5.3.9') >= 0,
    );

    $_conf_web_pass = is_writable(BASE_DIR . '/config');
    $_conf_cli_pass = true;

    $checked['config dir'] = array(
        'need'     => 'writable',
        'web'      => $_conf_web_pass ? 'writable' : 'no-writable',
        'cli'      => '',
        'web_pass' => $_conf_web_pass,
        'cli_pass' => $_conf_cli_pass,
    );

    foreach (array('pdo_mysql', 'mcrypt', 'mbstring') as $ext) {
        $web_pass = extension_loaded($ext);
        $cli_pass = !!shell_exec('/usr/bin/env php -m | grep ' . $ext);

        $checked[$ext . ' extension'] = array(
            'need'     => 'Installed',
            'web'      => $web_pass ? 'Installed' : 'Not Installed',
            'cli'      => $cli_pass ? 'Installed' : 'Not Installed',
            'web_pass' => $web_pass,
            'cli_pass' => $cli_pass
        );
    }

    $is_pass = true;
    foreach ($checked as $check) {
        if (!$check['web_pass'] || !$check['cli_pass']) $is_pass = false;
    }

    $res->render('index.php', array('checked' => $checked, 'is_pass' => $is_pass));
});

/**
 * 检测
 */
$app->get('/ping', function ($req, $res) {
    $res->json(array('success' => true));
});

/**
 * 测试数据库
 */
$app->post('/test', function ($req, $res) {
    $db = $req->data('db');
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'], $db['username'], $db['password']);
    $tables = $pdo->query('SHOW TABLES');

    $success = true;
    $message = 'Database test OK!';
    if (!$tables->execute()) {
        $success = false;
    } else if ($tables->fetchAll()) {
        $success = false;
        $message = 'Tables is already exists!';
    }
    $res->json(array('success' => $success, 'message' => $message));
});

/**
 * 提交
 */
$app->post('/setup', function ($req, $res) {
    $default_config = array('debug' => true);

    $default_db = array(
        'type'     => 'mysql',
        'host'     => 'localhost',
        'port'     => '3306',
        'dbname'   => 'inews',
        'username' => 'root',
        'password' => '',
        'charset'  => 'utf8',
        'options'  => array()
    );

    $default_site = array(
        'title'        => 'iNews',
        'title_suffix' => '- iNews',
        'default_meta' => '',
        'keywords'     => '',
        'footer'       => '',
        'search_bar'   => '',
        'menus'        => array(
            array('Latest', '/latest', 'clock'),
            array('Leaders', '/leaders', 'user'),
        ),
        'share_text'   => '我在 {site_title} 分享了 {title}'
    );

    $db = $req->data('db');
    $admin = $req->data('admin');
    $config = $req->data('config');

    if (!$pdo = testConnection($db)) {
        echo 'Mysql connect error!';
        return;
    }

    /**
     * 初始化数据库
     */
    $sql = file_get_contents(APP_DIR . '/migrations/schema.sql');
    $pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, 0);
    try {
        $pdo->exec($sql);
    } catch (\PDOException $e) {
        echo 'SQL execute error!';
        return;
    }

    /**
     * 生成配置
     */
    $config['site'] += $default_site;
    $config['database'] = $db + $default_db;
    $config += $default_config;
    file_put_contents(BASE_DIR . '/config/env', 'production');
    file_put_contents(BASE_DIR . '/config/production.php', '<?php return ' . var_export($config, true) . ';');

    /**
     * 升级数据库
     */
    $command = 'PAGON_ENV=production /usr/bin/env php ' . BASE_DIR . '/bin/task db:migrate 2>&1';
    shell_exec($command);

    /**
     * 生成用户
     */
    $password = \Helper\Crypt::makePassword($admin['password'], $config['password_salt']);
    try {
        $pdo->exec("INSERT INTO `user` (`name`, `password`, `status`, `created_at`) VALUES ('{$admin['username']}', '{$password}', 1, '" . date('Y-m-d H:i:s') . "')");
    } catch (\PDOException $e) {
        echo "Install failed";
        return;
    }
    if (is_writable(__DIR__) && @rmdir(__DIR__)) {
        echo "Install OK!";
    } else {
        echo "Install OK! but " . __DIR__ . ' is not delete, plz delete manually.';
    }
    echo " Redirecting... <script type='text/javascript'>window.setTimeout(function(){window.location.href='" . url('/') . "';}, 3000);</script>";
});

$app->run();


function testConnection($db)
{
    try {
        $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'], $db['username'], $db['password']);
        $query = $pdo->query('SELECT 1');
        return $query->execute() ? $pdo : false;
    } catch (\PDOException $e) {
        return false;
    }
}