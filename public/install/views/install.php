<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8"/>
    <meta name="robots" content="all"/>
    <title>安装iNews</title>
    <meta name="viewport" content="initial-scale=1.0"/>
    <link rel="stylesheet" href="/static/essage.css"/>
    <link rel="stylesheet" href="/static/style.css"/>
    <link rel="stylesheet" href="/install/static/style.css"/>
    <link rel="icon shortcut" href="/favicon.png"/>
    <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
    <script type="text/javascript">
        var is_pass = <?php echo json_encode($is_pass); ?>;
    </script>
</head>
<body>

<header></header>

<div class="wrapper list wrapper-padding">
    <h1>
        iNews install application
    </h1>

    <div>
        <table class="typo-table">
            <tr>
                <th>Name</th>
                <th>Need</th>
                <th>WEB</th>
                <th>CLI</th>
            </tr>
            <?php foreach ($checked as $name => $check): ?>
                <tr>
                    <td class="table-head"><?php echo $name; ?></td>
                    <td><?php echo $check['need']; ?></td>
                    <td class="<?php echo $check['web_pass'] ? 'pass' : 'reject'; ?>"><?php echo $check['web']; ?></td>
                    <td class="<?php echo $check['cli_pass'] ? 'pass' : 'reject'; ?>"><?php echo $check['cli'] ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    </div>

    <div>
        <form action="/setup" method="POST">
            <h2>Mysql Setup:</h2>

            <h3>Host:</h3>

            <div>
                <input name="db[host]" type="text" placeholder="IP/Domain" value="127.0.0.1"/>
            </div>

            <h3>Database:</h3>

            <div>
                <input name="db[dbname]" type="text" placeholder="Name" value="inews"/>
            </div>

            <h3>Username:</h3>

            <div>
                <input name="db[username]" type="text" placeholder="" value="root"/>
            </div>

            <h3>Password:</h3>

            <div>
                <input name="db[password]" type="text" placeholder=""/>
            </div>

            <div>
                <input type="button" id="test" value="Test connection"/>
            </div>

            <h2>Site Setup:</h2>

            <h3>Title:</h3>

            <div>
                <input name="config[site][title]" type="text" placeholder="" value="iNews"/>
            </div>

            <h3>Password Salt:</h3>

            <div>
                <input name="config[password_salt]" type="text" placeholder="" value="d#!AVFed"/>
            </div>

            <h3>GA ID:</h3>

            <div>
                <input name="config[ga]" type="text" placeholder="Google Analytics ID" value=""/>
            </div>

            <h2>Admin Setup:</h2>

            <h3>Username:</h3>

            <div>
                <input name="admin[username]" type="text" placeholder="" value="admin"/>
            </div>

            <h3>Password:</h3>

            <div>
                <input name="admin[password]" type="text" placeholder="" value="admin"/>
            </div>

            <div>
                <input type="submit" value="Confirm and Install the application"/>
            </div>
        </form>
    </div>
</div>

<footer class="wrapper">
    Powered by <a href="http://inews.io" title="inews.io">iNews.io</a>.&nbsp;
</footer>

<script type="text/javascript" src="/static/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="/static/validator.js"></script>
<script type="text/javascript" src="/static/essage.js"></script>
<script type="text/javascript" src="/install/static/app.js"></script>
</body>
</html>
