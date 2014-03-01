<?php 

require_once("dbconn.php");
require_once("../Admin/utilities.php");

$db = new db();
$db->connect();

switch($_POST['method'])
{
    
    case "CheckForNewVisitor":
        CheckForNewVisitor();
        break;
    case "CheckForNewMessages":
        
        Update( $_POST['visitorID'] ,true);
        break;
    
    case "AdminChatSend":
        session_start();
        ChatSend( $_POST['visitorID'], 1, $_POST['msg']);
        break;
    
    case "Register":
        Register();
        break;
    
    case "ChatSend":
        session_start();
        ChatSend( $_SESSION['visitorID'], 0 ,$_POST['msg']);
        break;
    
    case "VisitorSessionCheck":
        VisitorSessionCheck();
        break;
    
    case "Update":
        session_start();
        Update($_SESSION['visitorID'],false);
        break;
}

function CheckForNewVisitor()
{
    $query = "SELECT DISTINCT `visitorID`,`name` FROM chatMessage, visitor WHERE chatMessage.visitorID = visitor.id";
    $ret = mysql_query($query);
    
    
    $loaded = $_POST['loaded'];
    if($ret)
    {
        $i = 0;
        while($row = mysql_fetch_assoc($ret))
        {
            if($i >= $loaded)
            {
                echo "<option value = '{$row['visitorID']}'>{$row['name']}</option>";
            }
            $i++;
        }
        
    }
    else
        die(mysql_error());
    
}



//////////////////Client Side///////////////////
///VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV


function ChatSend($visitorID, $isOutgoing, $msg)
{

    if(isset($visitorID))
    {
        
//        $msg = ;
        $current = getdate()['seconds'];
        $time = 0;
        session_start();
        if(isset($_SESSION['lastMessageSent']))
        {
            $time = $_SESSION['lastMessageSent'];
        }
        
        $_SESSION['lastMessageSent'] = $current;
        
        /// blocks message
        if( $current - $time < 2)
                return;
        
        if( strlen( trim($msg) ) > 0 )
        {
            $msg = trim($msg,"<>");
            $msg2 = mysql_real_escape_string($msg);
            $query = "INSERT INTO chatMessage(visitorID, message, isOutgoing) VALUES($visitorID, '$msg2', $isOutgoing)";
            
            $ret = mysql_query($query);
            if(!$ret)
                die(mysql_error());
            
            echo "<div class = 'out'><span>$msg</span></div>";
        }
    }


}
    
function Update($visitorID, $isAdmin)
{
    
    if( isset($visitorID) )
    {
        if(!$isAdmin)
        {
            $query = "UPDATE visitor SET exitTime=CURTIME() WHERE id = $visitorID";

            $ret = mysql_query($query);
            if(!$ret)
                die(mysql_error());
        }
        
        $query = "SELECT message, isOutgoing FROM chatMessage WHERE visitorID = $visitorID";
        
        $ret = mysql_query($query);
        if(!$ret)
            die(mysql_error());
        else
        {
            $skipCount = $_POST['skipCount'];
            $i = 0;
            while($row = mysql_fetch_assoc($ret))
            {
                if($i >= $skipCount)
                {
                    $msg = $row['message'];
                    if($row['isOutgoing'] && !$isAdmin || !$row['isOutgoing'] && $isAdmin)
                        echo "<div class = 'in'><span>$msg</span></div>";
                    else
                        echo "<div class = 'out'><span>$msg</span></div>";
                }
                $i++;
            }
        }
        
        
        
        
    }
    
    
    
}
    
function Register()
{
    session_start();
    if( isset($_SESSION['visitorID'] )){
        
        if( strlen( trim($_POST['name']) ) > 0 )
        {
            $query = "UPDATE visitor SET name='{$_POST['name']}' WHERE id = {$_SESSION['visitorID']}";

            $ret = mysql_query($query);
            if(!$ret)
                die(mysql_error());
            
            echo "ok";
            
            
            ChatSend($_SESSION['visitorID'], 1, "Hi {$_POST['name']}! How can I help you?");
            
        }
        
        
    }
}
    
function VisitorSessionCheck()
{
    session_start();
    
    if( !isset($_SESSION['visitorID'] ) )
    {
        $ip = GetUserIP();
        $query = "INSERT INTO visitor(ip, date, entryTime, exitTime) VALUES('$ip', CURDATE(), CURTIME(),CURTIME())";
        
        $ret = mysql_query($query);
        if(!$ret)
            die(mysql_error());
        
        $query = "SELECT id FROM visitor ORDER BY id DESC LIMIT 1";
        
        $ret = mysql_query($query);
        if(!$ret)
            die(mysql_error());
        else
            $_SESSION['visitorID'] = mysql_fetch_assoc($ret)['id'];
    }
    
    
    $query = "SELECT name FROM visitor WHERE id = {$_SESSION['visitorID']}";
        
    $ret = mysql_query($query);
    if(!$ret)
        die(mysql_error());
    else
    {
        $name = mysql_fetch_assoc($ret)['name'];
        if($name != "")
            echo "ok";
    }
    
    
//    echo "id: " . $_SESSION['visitorID'];
    
}

?>