<?php 

    date_default_timezone_set('Asia/Manila');

    require_once("dbconn.php");
    
    $db = new db();
    $db->connect();


    switch($_POST['method'])
    {
        case "SaveHistory":
            SaveHistory();
        break;
        
        case "LoadHistoryState":
            LoadHistoryState();
        break;
        
        case "RevertToHistoryState":
            RevertToHistoryState();
        break;
        
    }

    function LoadHistoryState()
    {
        $query = "SElECT * FROM history";
        
        $ret = mysql_query($query);
        if($ret)
        {
            while($row = mysql_fetch_assoc($ret))
            {
                echo "<li onclick='revertToHistoryState({$row['historyID']})'><span>[{$row['dateTime']}]</span><br> {$row['description']}</li>";
            }
        }
        else
        {
            die(mysql_error());
        }
    }

    function SaveHistory()
    {
        
        $content = mysql_real_escape_string($_POST['content']);
        $type = mysql_real_escape_string($_POST['type']);
        $desc = mysql_real_escape_string($_POST['desc']);
        
        $query = "INSERT INTO history(type,content,description, dateTime) VALUES('$type', '$content', '$desc' ,NOW())";
//        echo $query;
        $ret = mysql_query($query);
        if($ret)
        {
            echo date("h:i A");
        }
        else
        {
            die(mysql_error());
        }
    }

    function RevertToHistoryState()
    {
        
        $id = mysql_real_escape_string($_POST['id']);
        
        if($id == "last")
            $query = "(SELECT * FROM history WHERE type = 'element' ORDER BY historyID DESC LIMIT 1)
            UNION (SELECT * FROM history WHERE type = 'color' ORDER BY historyID DESC LIMIT 1); ";
        else
            $query = "SELECT * FROM history WHERE historyID = '$id'";
        
        $ret = mysql_query($query);
//        echo $query;
        if($ret)
        {
            $separator = "";
            while($row = mysql_fetch_assoc($ret))
            {
                echo $separator . $row['type'] . "[<:historyDivider:>]" . $row['content'];
                $separator = "[<:diffHistory:>]";
            }
        }
        else
            die(mysql_error());
    }

?>