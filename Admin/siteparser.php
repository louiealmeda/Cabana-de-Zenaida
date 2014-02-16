<?php 
    
//    $path = "components/" . $_POST['path'];
    
    $get = false;
    $path = "../website/index.html";

    $file=fopen($path,"r") or exit("Unable to open $path!");
    while (!feof($file))
    {

        $line = fgets($file);
        
//        echo $line;
        
        if( strpos($line, "<body>") != -1)
        {
            $get = true;
        }
            
        
        if($get)
        {
            
            if( strpos($line, "</body>") != -1)
            {
                $get = false;

                
            }
            else
                echo $line;
            
        }
    }
    fclose($file);

?>