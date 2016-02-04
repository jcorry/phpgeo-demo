<!DOCTYPE html>
<html>
<head>
    <title>Laravel</title>

    <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="{{ elixir("css/app.css") }}">
    <script type="text/javascript" src="/js/config.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.22/require.js"></script>

</head>
<body>
<div class="container">
    <div class="content">
        @yield('content')
    </div>
</div>
<script type="text/javascript">
    @yield('script')
</script>
</body>
</html>
