/*
Informacion Importante:
Gracias especiales al careverga de hanyerk por enseñarme 
Creador de la apk
https://github.com/umer0586/AndroidSMSServer
la Apk requiere Android 5.0
Esta aplicación convierte el 
dispositivo Android en una puerta 
de enlace SMS que permite enviar 
SMS a través del dispositivo Android 
mediante solicitudes HTTP a través de
la red Wi-Fi local.
Requiere Node Js 
https://nodejs.org/es/
*/

/* 
USO
Para enviar SMS, el cliente HTTP debe proporcionar parámetros de teléfono y mensaje a la ruta /sendSMS a través del método POST
*/

/*
Pasos:
1- descargar el contenido completo del repositorio
2- copiar el archivo apk en el cel y luego instalarlo
3- conectar mediante wifi el dispositivo android y el computador en la misma red
4- iniciar/dar permisos
5- obtener ip dentro de apk y puerto a usar
6- en la linea 35 del codigo , reemplazar la ip por la que tiene nuestro dispositivo agregando el puerto 
7- Escribir en message el texto a enviar, no superior a 160 caracteres
8- En list colocar la lista de numeros a quienes quieras enviar el mensaje, dentro de los corchetes
9- Abrir la consola de comandos y ejecutarlo usando node
10- Mira la magia

*/


/*
ASUNTOS MENORES A TENER EN CUENTA
Su router no debe bloquear la conexion de puertos entre equipos de manera entrante ni saliente
Si el proceso se detiene en el celular no dejará de intentar enviar mensajes la herramienta
Si necesita soporte en la instacion escriba a @Chaoticsystem telegram
*/
const request = require('request');
 
 async function sendMessages(phone = '', message = ''){
	return new Promise(function(R){
		request.post({
		  url: 'http://192.168.177.96:8080/sendSMS',  //cambiar por la mostrada en la aplicacion
		  form: { phone, message }
		}, function (err, httpResponse, body = null){ 
			R({phone, body});
		});
	});
	
 };
 
var max =100;
var min =1;
 
 // inicial la verga.
 (async function(){
	var list = [];   // formato [3003003030,3003013131,3003023232]
	var message = 'Testing Sms';	
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
