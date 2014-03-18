<?php 

switch($_POST['method'])
{
    case "SessionCheck": SessionCheck(); break;
    case "GetUserIP": echo GetUserIP(); break;
}

function SessionCheck()
{
    session_start();
    
    if( !isset($_SESSION['username'] ) )
    {
        //if not logged in
        if($_POST['isLogin'] == "false")//is not from login form
        {
            echo 'login.html';
        }
        
    }
    else
    {
        //if logged in
        if($_POST['isLogin'] == "true") // from any form
            echo 'index.html?' . $_SESSION['username'] ;
        
       die();
    }
    
    
}



function GetUserIP()
{
    $client  = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote  = $_SERVER['REMOTE_ADDR'];

    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    return $ip;
}

?>