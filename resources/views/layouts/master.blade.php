<!DOCTYPE html>
<html class="{!! isset($page) ? $page : null !!}">
<head>
    <title>PHP Geo Data Demo</title>

    <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
    <link rel="stylesheet" type="text/css" href="{{ elixir("css/app.css") }}">
    <script type="text/javascript" src="/js/config.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.22/require.js"></script>
    <meta name="_token" content="{{Crypt::encrypt(csrf_token())}}" />

</head>
<body>
<div class="container" id="wrapper">
    @yield('content')
</div>
<script type="text/javascript">
    @yield('script')
</script>
</body>
</html>