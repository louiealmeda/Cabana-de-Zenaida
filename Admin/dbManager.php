<?php 

    require_once("dbconn.php");
    require_once("imageManipulator.php");
    
    $db = new db();
    $db->connect();
//    echo "test";
    switch($_POST['method'])
    {
        ///////rever to publish
        ////enabled
        case "publish":
            
            session_start();
        
            $query = "SELECT password FROM `admin` WHERE username = '{$_SESSION['username']}' LIMIT 1";
            
           
//            echo $query;
            $ret = mysql_fetch_assoc(mysql_query($query))['password'];
             
            if(!$ret)
                die(mysql_error());
            
            if( $_POST['password'] != $ret)
                die("Wrong pasword");
        
            $frame = file_get_contents("frame.html");
            
            $frame = implode( $_POST['html'], explode("[<Content goes here>]", $frame));
            
            $file = fopen("../Website/styles.css", "w+");
            fwrite($file, $_POST['css']);
            fclose($file);
        
            $file = fopen("../Website/index.html", "w+");
            fwrite($file, $frame);
            fclose($file);
            
            echo "Published!";
//            echo $frame;
            die();
        break;
        
        case "getStyleSheet":
            $content = file_get_contents("Website/styles.css");
            
            $content = str_replace('../', '', $content);
            
            echo $content;
            break;
        
        case "getImageLibrary":
            $files = scandir("images/thumbs/");
            $newFiles = [];
            foreach($files as $f)
            {
                if(stripos($f,"png"))
                {
                    $newFiles[count($newFiles)] = "images/thumbs/" . $f;
                }
            }
        
            echo json_encode($newFiles);
            break;
        
        case "uploadImage":
            
//            $files = $_FILES[;
            uploadImage();
            
//            $files = scandir("images/library/");
//            foreach($files as $f)
//            {
//                if(stripos($f, "png") || stripos($f, "jpg") || stripos($f, "jpeg") || stripos($f, "gif") )
//                {
//                    echo "<li style='background-image:url(images/library/$f)'></li>";
//                }
//            }
//            break;
        
        case "getThemes":
            
            $query = "SELECT * FROM theme";
        
            $ret = mysql_query($query);
        
            if($ret)
            {
                while($row = mysql_fetch_assoc($ret))
                {
                    $values = implode("|",$row);
                    echo "<option value = '$values' >{$row['name']}</option>";
                }
            }
            else
                die(mysql_error());
            
            break;
    }
    

    function uploadImage()
    {
        $library = "images/library/";
        $thumbs = "images/thumbs/";
        $files = $_FILES;
        
        foreach($files as $f)
        {

            if( strpos($f["type"], "image") >= 0)
            {
                $name = explode(".", $f["name"])[0] . ".png";
                $from = $f["tmp_name"];
                
                imagepng(imagecreatefromstring(file_get_contents($from)), $library . $name);
                createThumb($library . $name);
                
                getImageLibrary();
//                move_uploaded_file($from, $library.$name);
//                resize($from,$thumbs.$name, 120);
            }
        }

    }

    

    function createThumb($name)
    {
        $image = new ImageMan();
        $image->load($name);
        $image->resizeToWidth(150);
        $fileName = explode("/", $name);
        $fileName = $fileName[count($fileName) -1];
        $image->save("images/thumbs/". $fileName);
    }
    

?>