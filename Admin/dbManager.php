<?php 

//    require_once("dbconn.php");
//    $db = new db();
//    $db->connect();
//    echo "test";
    switch($_POST['method'])
    {
        case "getStyleSheet":
            $content = file_get_contents("Website/styles.css");
            
            $content = str_replace('../', '', $content);
            
            echo $content;
            break;
        
        case "getImageLibrary":
             scandir("/images");
            break;
        
        case "uploadImage":
            
//            $files = $_FILES[;
            uploadImage();
            $files = scandir("images/library/");
            foreach($files as $f)
            {
                if(stripos($f, "png") || stripos($f, "jpg") || stripos($f, "jpeg") || stripos($f, "gif") )
                {
                    echo "<li style='background-image:url(images/library/$f)'></li>";
                }
            }
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
                $name = $f["name"];
                $from = $f["tmp_name"];
                
                move_uploaded_file($from, $library.$name);
//                resize($from,$thumbs.$name, 120);
            }
        }

    }

    function resize($name, $destination, $width)
    {
        
        echo $name;
//        $thumb = new Imagick($name);
    
        
        $size = GetimageSize($name);
        
        
        $height= round($width*$size[1]/$size[0]);
        
        
        $thumb = new Imagick();
        $thumb->readImage($name);
        $thumb->resizeImage($width,$height,Imagick::FILTER_CATROM,1);
        $thumb->writeImage($destination);

        $thumb->destroy(); 
    }
    

?>