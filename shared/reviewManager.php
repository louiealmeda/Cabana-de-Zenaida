<?php 



    require_once("../Admin/dbconn.php");
    $db = new db();
    $db->connect();

    switch($_POST['method'])
    {
        case "saveAdminReviewChanges":
            saveAdminReviewChanges();
            break;
        
        case "getAllReviews":
            getAllReviews();
            break;
        
        case "fetchMakeAReview":
            fetchMakeAReview();
            break;
        
        case "submitReview":
            submitReview();
            break;
        
        case "getAllClientReviews":
            getAllClientReviews();
            break;
    }

    

    function submitReview()
    {
        $reviewID = $_POST['reviewID'];
        $rating = $_POST['rating'];
        $content = $_POST['content'];
        echo "boom";
//            echo "UPDATE review SET  rating = $rating, content = '$content' WHERE reviewID =  $reviewID";
        echo getSingleRowFromDB("UPDATE review SET  rating = $rating, content = '$content' WHERE reviewID =  $reviewID");
        
        
    }

    function fetchMakeAReview()
    {
        $key = mysql_real_escape_string($_POST['passKey']);
        
        if(trim($key) == "")
            die();
        
//        $item = getSingleRowFromDB("SELECT * FROM review, guest WHERE passKey = '$key' LIMIT 1");
        $item = getSingleRowFromDB("SELECT * FROM review, guest WHERE content = '' AND guest.guestID = (SELECT guestID FROM review WHERE passKey = '$key' LIMIT 1)");
//        echo "<li>I am working</li>";
        
        if(!$item)
            die("Invalid key");
        
        
        echo "<li id ='{$item['guestID']}' class = 'editing'>
        <div id = 'name'>{$item['name']}</div>
        <div id = 'content'><span id = 'rating'></span>
            Rating:<select id = 'selectRating'>
            <option>5 (heighest)</option>
            <option>4</option>
            <option selected>3</option>
            <option>2</option>
            <option>1 (lowest)</option>
            </select>
            <textarea id = 'field' placeholder='share us your experience' ></textarea></div>
        <div id = 'date'>{$item['date']}</div>
        </li>";
        
        
        
        
    }


    function saveAdminReviewChanges()
    {
        $data = $_POST['data'];
        
        $data = json_decode($data);
        
        foreach($data as $i)
        {

//            echo $i["isHidden"];
//            queryAndCatch("UPDATE review SET isHidden = " . $i['isHidden'] . ", reply = '" . $i['reply'] . "'  WHERE reviewID = ". $i['reviewID']);
        }
        
//        echo "done";
    }

    function getAllReviews()
    {
        $filter = "";
        
        if(isset($_POST['fromClient']))
            $filter = " AND isHidden = false ";
        
        
        $query = "SELECT * FROM review, guest WHERE review.guestID = guest.guestID AND content != '' $filter ";
        $ret = mysql_query($query);
    
        if($ret)
        {
            $str = "[";
            $separator = "";
            while($row = mysql_fetch_assoc($ret))
            {
                $str .= $separator . json_encode($row);
                $separator = ",";
            }
            
            $str .= "]";
            echo $str;
        }
        else
            die(mysql_error());
        
    }

    function queryAndCatch($query)
    {
        $ret = mysql_query($query);
        if(!$ret)
            die(mysql_error());
        
        return $ret;
    }

    function getSingleRowFromDB($query)
    {
        $ret = mysql_query($query);
        if(!$ret)
            die(mysql_error());
        
        return mysql_fetch_assoc($ret);
    }


?>