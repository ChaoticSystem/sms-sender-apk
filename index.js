const request = require('request');

/*
request.post({
  url: 'http://192.168.20.89:8081/sendSMS',
  form: {
    phone: '573002960022',
    message: 'Your verification code is 1234'
  }
}, function (err, httpResponse, body) { 

    console.log(body);

 })
 */
 
 async function sendMessages(phone = '', message = ''){
	//console.log('phone: '+phone, 'message: '+ message);
	return new Promise(function(R){
		request.post({
		  url: 'http://192.168.177.96:8080/sendSMS',
		  form: { phone, message }
		}, function (err, httpResponse, body = null){ 
			R({phone, body});
		});
	});
	
 };
 
var max =100;
var min =1;
 
 // inicial la verga.
 // 3182386760 3002960022
 (async function(){
	var list = [];
	var message = 'Testing Sms';
	//var message = 'Null';
	/*var l = list.length;
	var i = 0;
	while(i < l){
		var phone = list[i];
		var r = await sendMessages(phone, message);
		console.log('#'+(i+1)+'. r:', r);
		//break;
		i++;
	}*/
	const progress = {
		value: 0,
		max: 100,
		set: function(val){
			this.value = val;
			this.show();
		},
		show: function(){
			var percent = Math.round(this.value * 100 / this.max);
			var bars = '-'.repeat(100);
			var prog = ('='.repeat(percent) + bars.slice(percent)).substr(0, 100);
			console.log(percent+'%', prog, '100%');
			console.log('this.value:', this.value);
			console.log('this.max:', this.max);
			console.log('percent:', percent);
		}
	};
	
	progress.value = 0;
	progress.max   = list.length;
	progress.set(0);
	
	var groups = [];
	var limit = 1;
	while(list.length){
		groups.push(list.splice(0, limit));
	}
	
	
	var index = 0;
	while(groups.length){
		var group = groups.shift();
		var allFN = [];
		while(group.length){
			var phone = group.shift();
			//allFN.push(sendMessages(phone, message + ' '+ Math.floor(Math.random() * max) + min));
			allFN.push(sendMessages(phone, message));
			await new Promise(function(R){ setTimeout(R, 1e3 * 3); });
		}
		console.log('allFN:', allFN);
		var results = await Promise.all(allFN);
		console.log('results:', results);
		var err = 0;
		results.map(r => {
			var json = null;
			try{
				if(typeof r.body !== 'undefined' && r.body != null){
					json = JSON.parse(r.body);
				}
			}catch(ex){}
			if(json == null || typeof json.reason !== 'undefined'){
				err++;
				groups.push([r.phone]);
			}else{
				index++;
			}
			console.log('index:', index);
		});
		console.log('err:', err);
		progress.set(index);
		if(groups.length){
			if(err > 0){
				await new Promise(function(R){ setTimeout(R, 1e3 * 3); });
			}else{
				await new Promise(function(R){ setTimeout(R, 1e3); });
			}
		}
	}
 })();