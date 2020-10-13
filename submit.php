<?php
    function set_document()
    {
        $cityRef = $db->collection('TextData')->document();
        $cityRef->set([
            'Text' => $_POST["text"]
        ], ['merge' => true]);
        $pyscript = 'Scripts\cloudGen.py';
        $python = 'python';

        $cmd = "$python $pyscript $cityRef";
        echo $cmd;
    }
    if(isset($_POST['text']))
    {
        set_document();
    } 
?>
    
