<?php 

    require_once("dbconn.php");
    $db = new db();
    $db->connect();


    switch($_POST['method'])
    {
        case "GetWeekRange":
            GetWeekRange();    
            break;
        
        case "logout":
            session_start();
            session_destroy();
            echo "index.html";
            break;
    }


    function GetWeekRange($year = "2014")
    {
        
        
        
//        GenerateTestData(1,90,0,10);
        
        $startingDate = GetSingleValueFromDB('visitor', 'date', 'ASC');
        $endingDate = GetSingleValueFromDB('visitor', 'date', 'DESC');
        
        $startingMonth = DateToMonthNumber($startingDate);
        $endingMonth = DateToMonthNumber($endingDate);   
        $startingYear = DateToYearNumber($startingDate);
        $endingYear = DateToYearNumber($endingDate);   
        
        $weeksStats;
        for($i = $start; $i <= $end; $i++)
        {
            $weeksStats[$i] = GetSingleValueFromDB("visitor", "count(id)", "ASC",  "WHERE date BETWEEN '" . WeekNumberToDate($year, $i) . "' AND '". WeekNumberToDate($year, $i + 1) . "'"  );
            
        }
        
        $daysStats;
        $startingDay = DateToDayNumber( MonthNumberToDate($startingMonth)) + 1;
        $endingDay = DateToDayNumber( MonthNumberToDate($endingMonth + 1));
        
        $yearMonth = date("Y-m", mktime(0,0,0,1, $startingDay,$year));
        for($day = $startingDay ; $day <= $endingDay; $day++)
        {
            $prev = $yearMonth;
            $yearMonth = date("Y-m", mktime(0,0,0,1, $day,$year));
            $separator = ",";
            
            if($day == $startingDay)
                $separator = "";
            
            if($prev != $yearMonth)
            {
                $separator = "";
                $daysStats .= "<m>";
            }
//                $dayCtr = 0;
//            $daysStats[$yearMonth][$dayCtr++]
            
            $daysStats .= $separator . GetSingleValueFromDB("visitor", "count(id)", "ASC",  "WHERE date = '" . date("Y-m-d", mktime(0,0,0,1,$day,$year)) . "'" );

//            echo date("Y-m-d", mktime(0,0,0,1, $day,$year)) ."\n";
        }
        
        
        
//        $daysStats = implode(",", $daysStats);
        
//        $weeksStats = implode(",", $weeksStats);
        echo "$daysStats|$monthStats";
    }





//////////////Helper Functions/////////////////

    function DeleteTestData()
    {
        $query = "DELETE FROM visitor WHERE name = 'testData' ";
        
        $ret = mysql_query($query);
        
        if(!$ret)
            die(mysql_error());
    }

    function GenerateTestData($startDay, $endDay, $min = 0, $max = 100)
    {
        
        for($i = $startDay; $i < $endDay; $i++)
        {
            $date = DayNumberToDate($i);
            
            $n = abs(rand() % $max);
            
            for($j = 0; $j < $n; $j++)
            {
//                echo "\n".$date;
                $query = "INSERT INTO `visitor`(`name`, `ip`, `date`, `entryTime`, `exitTime`) VALUES ('testData', '::1', '$date','','')";
                
                $ret = mysql_query($query);
                if(!$ret)
                    die(mysql_error());
            }
            
        }
        
        
    }


    function GetSingleValueFromDB($table, $column, $order, $condition = "")
    {
        $query = "SELECT $column FROM $table $condition ORDER BY $column $order LIMIT 1";
        $ret = mysql_query($query);
        
        
        if($ret)
        {
            return mysql_fetch_assoc($ret)[$column];
        }
        else
            die(mysql_error());
    }


    function GetWeekNumber($dateString)
    {
        $dateArray = explode("-", $dateString);
        $date  = mktime(0, 0, 0, $dateArray[1], $dateArray[2], $dateArray[0]);
        $week  = (int)date('W', $date);
        return $week;
    }

    function DateToYearNumber($dateString)
    {
        $dateArray = explode("-", $dateString);
        $date  = mktime(0, 0, 0, $dateArray[1], $dateArray[2], $dateArray[0]);
        return date("y", $date );
    }

    function DateToDayNumber($dateString)
    {
        $dateArray = explode("-", $dateString);
        $date  = mktime(0, 0, 0, $dateArray[1], $dateArray[2], $dateArray[0]);
        return date("z", $date );
    }

    function DateToMonthNumber($dateString)
    {
        $dateArray = explode("-", $dateString);
        $date  = mktime(0, 0, 0, $dateArray[1], $dateArray[2], $dateArray[0]);
        return date("m", $date );
    }

    function MonthNumberToDate($month, $year = 2014)
    {
        return date('Y-m-d', mktime(0,0,0,$month,1,$year));
    }


    function DayNumberToDate($day, $year = 2014)
    {
        return date('Y-m-d', mktime(0,0,0,1,$day,$year));
    }

    function WeekNumberToDate($year, $weekNumber)
    {
        $weekStart = new DateTime();
        $weekStart->setISODate($year,$weekNumber);
        return $weekStart->format('Y-m-d');
    }

    

?>