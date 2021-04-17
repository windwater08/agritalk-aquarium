 $(function(){
    csmapi.set_endpoint ('https://iot.iottalk.tw');
    var profile = {
        //'dm_name': 'Dummy_Device',
        'dm_name': 'PTZcontroller',          
        //'idf_list':[Dummy_Sensor],
        'idf_list':[Up_I, Down_I, Right_I, Left_I],
        'odf_list':[PTZcommand_O, Geolocation_O],
		'd_name': 'AgriTalk_Aquarium',
    };
    /*	
    function Dummy_Sensor(){
        return Math.random();
    }
    function Dummy_Control(data){
        $('.ODF_value')[0].innerText=data[0];
    }
    */
    function Up_I(){
    }
    function Down_I(){
    }
    function Right_I(){
    }
    function Left_I(){
    }
    function PTZcommand_O (data){
        var dt = new Date();
        switch( data[0]) {
            case 1:
                command = "Down";
                break;
            case 2:
                command = "Left";
                break;
            case 3:
                command = "Right";
                break;
            case 4:
                command = "Up";	
                break;
            case 5:
                command = "Zoom-in";
                break;
            case 6:
                command = "Zoom-out";
                break;
        }
//        document.getElementById("PTZcommands").value = command + " at " + ("0"+dt.getHours()).slice(-2) +":"+ ("0"+dt.getMinutes()).slice(-2) +":"+ ("0"+dt.getSeconds()).slice(-2);
        //document.getElementById("PTZcommands").value = command + " by " + data[1] + " at " + ("0"+dt.getHours()).slice(-2) +":"+ ("0"+dt.getMinutes()).slice(-2) +":"+ ("0"+dt.getSeconds()).slice(-2);
        //document.getElementById("PTZcommands").value = command + " by " + data[1] + " at " + dt.toLocaleTimeString();
    }
    var coordinate = [0, 90];
    function Geolocation_O(x, y){
        var coordinate_next = [x, y];
        var degree_right = 360/100;  // each step
        var degree_left = 360/90;
        //var theta = Math.atan((coordinate_next[1]-coordinate[1])/(coordinate_next[0]-coordinate[0])) * 180/Math.PI;
        var theta = Math.atan(1)* 180/Math.PI;
            console.log(theta);
        coordinate = coordinate_next;
        }
/*******************************************************************/                
        function ida_init(){console.log('Registered.')}
        var ida = {
            'ida_init': ida_init,
        }; 
        dai(profile,ida);     
});
