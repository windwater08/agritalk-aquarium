from flask import (Flask, abort, jsonify, redirect, g,
                   render_template as flast_render_template,
                   request, send_from_directory, session)
from sqlalchemy import text
from werkzeug.security import check_password_hash, generate_password_hash
#windwater08 modify
from flask import Response
import requests
from requests.auth import HTTPBasicAuth
from threading import Thread

from flask import Flask, render_template
import json

Session = requests.Session();
Session.keep_alive = False;


app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
@app.route('/Control', methods=['GET'])
def Control():
    return render_template('Control.html')
@app.route('/Dashboard', methods=['GET'])
def Dashboard():
    return render_template('Dashboard.html')
@app.route('/CorsSwitchChange', methods=['POST'])
def CorsSwitchChange():
	info = request.form.to_dict();
	#print("info: ",info);
	#{'UserName': 'admin', 'Method': 'POST', 'SwitchIndex': '1', 'Port': '11166', 'protocol': 'http', 'IP': 'dashboard.fishtalk.tw', 'Clicked': '0', 'Password': 'E985o630'}
	headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
	if int(info['pluse']):
		if info['Method'] == 'GET':
			r = Session.get(info['protocol']+'://'+info['IP']+':'+info['Port']+'/relay.cgi?pulse' +str((int(info['SwitchIndex'])+1))+ '=pluse', auth=HTTPBasicAuth(info['UserName'], info['Password']),headers=headers)
			print("URL: ",info['protocol']+'://'+info['IP']+':'+info['Port']+'/relay.cgi?pulse' +info['SwitchIndex']+ '=pluse');
		return json.dumps({"state":"ok"})
	elif int(info['Clicked']): 
		datas={'relayon'+info['SwitchIndex']:"on"}
	else:
		datas={'relayoff'+info['SwitchIndex']:"off"}
	if info['Method'] == 'POST':
		r = Session.post(info['protocol']+'://'+info['IP']+':'+info['Port']+'/relay.cgi', auth=HTTPBasicAuth(info['UserName'], info['Password']),headers=headers ,data=datas)
	return json.dumps({"state":"ok"})
@app.route('/CorsSwitchState', methods=['POST'])
def CorsSwitchState():
	info = request.form.to_dict();
	#{'UserName': 'admin', 'Method': 'POST', 'SwitchIndex': '1', 'Port': '11166', 'protocol': 'http', 'IP': 'dashboard.fishtalk.tw', 'Clicked': '0', 'Password': 'E985o630'}
	headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
	res = Session.get(info['protocol']+'://'+info['IP']+':'+info['Port']+'/relay.cgi', auth=HTTPBasicAuth(info['UserName'], info['Password']),headers=headers)
	strlist = res.text.split('<button name="relayon');
	data ={}
	for i in range(100):
		try:
			ID = 0
			if i < 9 :
				ID = int(strlist[i+1][0])
			else:
				ID = int(strlist[i+1][0]+strlist[i+1][1])
			if "lighton.jpg" in strlist[i+1]: 
				data["Switch"+str(ID)] = "on";
			else:
				data["Switch"+str(ID)] = "off";
		except:
			break
	return json.dumps(data)
	
def main():
    app.run('0', port=60001, debug=True, threaded=True)

if __name__ == '__main__':
    main()