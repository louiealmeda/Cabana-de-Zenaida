<?php 
    date_default_timezone_set('Asia/Manila');
    
    require_once("../Admin/dbconn.php");
    $db = new db();
    $db->connect();


    switch($_POST['method'])
    {
        case "fetchReservedDays":
            fetchReservedDays();
            break;
    }
    


    function fetchReservedDays()
    {
        $today = date("Y-m-d");
            
        $ret = queryAndCatch("SELECT * FROM reservation WHERE startDate >= '$today' || endDate >= '$today' ");
        
        $periods = [];
        
        
        
        while($row = mysql_fetch_assoc($ret))
        {
            $start = $row['startDate'];
            $end = $row['endDate'];
            
            
            $periods[$start]["count"] = 0;
            
            $days = subtractDates($start, $end);
            
            
//            if($row['endPeriod']=='m')
//                $days--;
//            
//            if($row['startPeriod']=='e')
//            {
//                $periods[$start] = 0;
//                $days--;
//            }
            
            
            
            for($i = 0 ; $i < $days; $i++ )
            {
                $periods[$start]["count"]++;
            }
            

            $periods[$start]["end"] = $row['endPeriod'];
            $periods[$start]["start"] = $row['startPeriod'];
//            echo json_encode($row);
            
            
        }
        
        echo json_encode($periods);
        
        
        
    }



    function subtractDates($fromDate,$toDate)
    {
        $toDate= strtotime($toDate);
        $fromDate= strtotime($fromDate);
        $seconds = $toDate- $fromDate;
        $days = floor($seconds / (24 * 60 * 60 )); // convert to days
        return $days;
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