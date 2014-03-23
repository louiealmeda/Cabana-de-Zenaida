<?php 

    $username = $_POST['txtUsername'];
    $password = $_POST['txtPassword'];
    $keep = $_POST['cbKeep'];

    SanitizeUsername($username);

    $password = addslashes($password);
    $username = addslashes($username);
    
    $tryLimit = 7;
    $locked = false;

    require_once("dbconn.php");
    $db = new db();
    $db->connect();


//    session_start();
//    session_destroy();

    Lockup();

    $query = "SELECT password FROM admin where username = '$username' ";
    $ret = mysql_query($query);


    if( mysql_num_rows($ret) == 0)
    {
        echo "Wrong password or username";
        RecordMistake();
        
        die();
    }

    if($ret)
    {
        while($row = mysql_fetch_assoc($ret))
        {
            if($row['password'] == $password)
            {
                session_start();
                $_SESSION['username'] = $_POST['txtUsername'];
                $_SESSION['mistakes'] = 0;
//                echo file_get_contents('cms.html');
                echo "index.html";
            }
            else
            {
                echo "Wrong password or username";
                RecordMistake();
            }
        }
    } 
    else
        die(mysql_error());    
    


    function RecordMistake()
    {
        $tryLimit = 7;
        session_start();
        $_SESSION['mistakes'] = isset($_SESSION['mistakes']) ? $_SESSION['mistakes'] + 1 : 1;
        
        if($tryLimit - $_SESSION['mistakes'] <= 3)
            echo " " . ($tryLimit - $_SESSION['mistakes']) . " remaining retries";
        
        
        if(isset($_SESSION['mistakes']) && $_SESSION['mistakes'] >= $tryLimit -1)
            $_SESSION['locked'] = date("H:i");
        
        
    }

    function Lockup()
    {
        $waitTime = 5;
        session_start();

        if(isset($_SESSION['locked']))
        {

            $timeLocked = $_SESSION['locked'];
            $current = date("H:i");

            
            $minutesPast = (strtotime($current) - strtotime($timeLocked)) / 60;
            
//            echo $timeLocked . ", " . $current;
            
//            echo "[".$minutesPast;
            
            if($minutesPast >= $waitTime )
            {
                $_SESSION['mistakes'] = 0;
                unset($_SESSION['locked']);
            }
            else
                echo "Please wait for " . ($waitTime - $minutesPast) . " minute/s" ;
            
            
            die();
        }
            
    }

    function SanitizeUsername($username)
    {
        $validchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.";

        if( strlen( $username ) > 30)
        {
            echo ("username too long");
            die();
        }
        
        for( $i = 0; $i < strlen($username); $i++)
        {
            if( !strpos( $validchars, $username[$i] ))
            {
                echo ("invalid characters");
                die();
            }
        }
        
    }
?>