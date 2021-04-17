let device_id = null;
//var _ENDPOINT =  window.location.origin;
var _ENDPOINT =  "https://iot.iottalk.tw"; 
var password = null;
var numberOfSwitches = 0;
var profile = {
    'dm_name': 'Remote_control',
    'df_list':[],
    'd_name': '',
    'is_sim':false,
};

var SwitchInfo= {
		//IP: 'oysterliu.fishtalk.tw',
		//IP: 'dashboard.fishtalk.tw',
		//IP: '140.113.131.100',
		IP: '61.230.42.83',
		protocol: 'http',
		//Port: '11004',
		//Port: '11166',
		//Port: '80',
		Port: '60002',
		UserName: 'admin',
		Password: 'E985o630',
};    

function set_device_id(d_id, count){
    device_id = d_id;
    numberOfSwitches = count;
    profile['d_name'] = d_id;
    for (var index=1; index<=count; index++) 
    	profile['df_list'].push('Switch'+String(index));
	csmapi.set_endpoint(_ENDPOINT);   
}

function regisration_state(state, d_name, passwd){
    if (state){ 
        console.log('Register successfully.');
        password = passwd;
        load_alias_and_switchState(device_id, numberOfSwitches);	    
    }
    else console.log('Register failed.');
}

function state_check(data, exception=null){
    if (exception){
        if (String(exception.responseText).indexOf('mac_addr not found') != -1){
            console.log('Device is not existed. Try to register.');
            console.log('device_id =', device_id);
            csmapi.register(device_id, profile, regisration_state);
        }
        else if(String(exception.responseText).indexOf('password-key error') != -1){
	    console.log('Password is expired. Re-register.');
            console.log('Because device_auth is enabled, the Switch state cannot be loaded.');
	    csmapi.register(device_id, profile, regisration_state);
        }
        else{
        	console.log('Error occurred!');
            console.log('Response:', exception.responseText);
            console.log('Status:', exception.statusText);
            console.log('Endpoint =', _ENDPOINT);
        }
    }
    else{
        console.log('Device is existed. Continue.');
        if (profile['df_list'].length > data['df_list'].length){
            console.log('Required number of Switches larger than that in the server. Re-register.');
            csmapi.register(device_id, profile, regisration_state);
        }
	else load_alias_and_switchState(device_id, numberOfSwitches);
           
    }
}

function check_registerion_state(mac_addr){
    csmapi.pull(mac_addr, password, 'profile', state_check);
}

$(function () {
	console.log ("start");
	SwitchStateMsgdata = SwitchInfo;
	SwitchStateMsgdata ["Method"]= 'POST';
	$.ajax({
		type: 'POST',
		url: '/CorsSwitchState',
		data: SwitchStateMsgdata,
		dataType: "json",
		success: function(data) { 
			//console.log(data);
			for (var index=1; index<=numberOfSwitches; index++) 
				if(data["Switch"+ parseInt(index)] == "on")
					$('#'+"Switch"+ parseInt(index)).bootstrapToggle('on');					
		},
		error: function(jqXHR) {
			console.log(jqXHR);
		}
	});
	
	$(document).on('click', '.toggle', function() {
		var self_id = $(this)[0].childNodes[0].id;
		var InnerText = document.getElementById(self_id+"-span").innerText;
		var clicked = $(this).hasClass('btn-primary');
		//console.log (self_id);
		//console.log (InnerText);
		//console.log (ControlMsgdata);
		ControlMsgdata = SwitchInfo;
		ControlMsgdata ["SwitchIndex"]= parseInt(self_id.replace('Switch', '') -1).toString();
		ControlMsgdata ["Clicked"]= clicked ? '1' : '0';
		ControlMsgdata ["Method"]= 'POST';
		ControlMsgdata ["pluse"]= '0';
		
        if (InnerText.indexOf("Feeder")!=-1)
        {
        	if (clicked == true)
        	{
        		csmapi.push(device_id, password, self_id, [clicked ? 1 : 0]);
        		//console.log ("In clicked true");
        		$('#'+self_id).bootstrapToggle('disable');
				
				ControlMsgdata ["Method"]= 'GET';
				ControlMsgdata ["pluse"]= '1';
				$.ajax({
					type: 'POST',
					url: '/CorsSwitchChange',
					data: ControlMsgdata,
					dataType: "json",
					success: function(data) { 
						//console.log(data);                    
					},
					error: function(jqXHR) {
						console.log(jqXHR);
					}
				});
        		
        		setTimeout(function(){
        			console.log ("change to false");
        			console.log (document.getElementById(self_id).checked);
        			$('#'+self_id).bootstrapToggle('enable');
        			//$('#'+self_id).bootstrapToggle('on');
        			$('#'+self_id).bootstrapToggle('off');
        			$('#'+self_id).prop('checked', false).parent('span').addClass('checked').prop('checked', false);
        			//$('#'+self_id).bootstrapToggle('toggle');//變更目前狀態	
        			console.log (document.getElementById(self_id).checked);
        			csmapi.push(device_id, password, self_id, [document.getElementById(self_id).checked ? 1 : 0]);
                },3300);	
        	}
        }
        else if (InnerText.indexOf("UV")!=-1)
        {
			$.ajax({
				type: 'POST',
				url: '/CorsSwitchChange',
				data: ControlMsgdata,
				dataType: "json",
				success: function(data) { 
					//console.log(data);                    
				},
				error: function(jqXHR) {
					console.log(jqXHR);
				}
			});
			/*
			if (clicked == true)
        	{	
        		console.log ('#'+self_id);
        		$('#'+"Switch8").bootstrapToggle('enable');
        		//$('#'+"Switch8").bootstrapToggle('on');
        		$('#'+"Switch8").bootstrapToggle('off');
        		$('#'+"Switch8").prop('checked', false).parent('span').addClass('checked').prop('checked', false);
        		//$('#'+"Switch8").bootstrapToggle('toggle');//變更目前狀態	
        		csmapi.push(device_id, password, "Switch8", [document.getElementById("Switch8").checked ? 1 : 0]);
        	}
        	csmapi.push(device_id, password, self_id, [clicked ? 1 : 0]);
			*/
        }
        else if (InnerText.indexOf("Circulator")!=-1)
        {
			$.ajax({
				type: 'POST',
				url: '/CorsSwitchChange',
				data: ControlMsgdata,
				dataType: "json",
				success: function(data) { 
					//console.log(data);                    
				},
				error: function(jqXHR) {
					console.log(jqXHR);
				}
			});
			/*
			if (clicked == true)
        	{	
        		console.log ('#'+self_id);
        		$('#'+"Switch6").bootstrapToggle('enable');
        		//$('#'+"Switch6").bootstrapToggle('on');
        		$('#'+"Switch6").bootstrapToggle('off');
        		$('#'+"Switch6").prop('checked', false).parent('span').addClass('checked').prop('checked', false);
        		//$('#'+"Switch6").bootstrapToggle('toggle');//變更目前狀態	
        		csmapi.push(device_id, password, "Switch6", [document.getElementById("Switch6").checked ? 1 : 0]);
        	}
        	csmapi.push(device_id, password, self_id, [clicked ? 1 : 0]);
			*/
        }
        else
        {
        	$.ajax({
				type: 'POST',
				url: '/CorsSwitchChange',
				data: ControlMsgdata,
				dataType: "json",
				success: function(data) { 
					//console.log(data);                    
				},
				error: function(jqXHR) {
					console.log(jqXHR);
				}
			});
			csmapi.push(device_id, password, self_id, [clicked ? 1 : 0]);
        }
    });
});

function get_alias(mac_addr, df_name, callback){
    var alias;
    var ajax_obj = $.ajax({
        url:  _ENDPOINT +'/get_alias/' + mac_addr+ '/' + df_name,
        type: 'GET',
        data: {alias},
    }).done(function(alias){
        if(typeof callback === 'function') callback(df_name, alias['alias_name'][0]);
    });
}

function update_alias(df_name, alias){
    if (alias!=undefined) $('.'+df_name)[0].innerText = alias;
}

function load_alias_and_switchState(mac_addr, count){
    for(var index=1; index<=count; index++){
	    get_alias(mac_addr, 'Switch'+index.toString(), update_alias);
	    csmapi.pull(mac_addr, password, 'Switch'+String(index), update_switch_state);
    }
}

function update_switch_state(data, exception, df_name){
    //if (data.length != 0)
        //if (data[0][1][0] == 1) $('#'+df_name).bootstrapToggle('on');
}

function close_page(){
    document.location.href=window.location.origin;
}

function dereg(mac_addr) {
    var decision = confirm("警告: Delete this Controller.\nAre you sure?");
    if (decision){ 
        console.log('Deregister this reomte control and close the page now.');
	csmapi.deregister(mac_addr, close_page);
    }
    else{
        console.log('Won\'t deregister.');
    }
}

$(function () {
    console.log('SwitchSet JS has been successfully loaded.');
});
