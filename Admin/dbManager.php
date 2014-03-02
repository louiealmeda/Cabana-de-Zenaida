<?php 

//    require_once("dbconn.php");
//    $db = new $db();
//    $db->connect();
    
//    echo "test";
    switch($_POST['method'])
    {
        case "getStyleSheet":
            $content = file_get_contents("Website/styles.css");
            
            $content = str_replace('../', '', $content);
            
            echo $content;
            break;
    }
    

?>