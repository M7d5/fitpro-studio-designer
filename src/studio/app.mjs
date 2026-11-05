import {frame, Decoder, dialInfo, acknowledge, hex} from './protocol.mjs';
const $ = id => document.getElementById(id);
const presets = {orbit:['#c3f473','#101b17'],dune:['#eabc8b','#241a17'],wave:['#75d5e5','#101d2b'],minimal:['#dedccf','#191a1c']};
let theme='orbit', photo=null, photoUrl=null, busy=false, selected=null, tx=null, rx=null, info=null;
let decoder=new Decoder(), writeQueue=Promise.resolve(), gattServices=[], identity={}, battery=null;
const events=[];
let toastTimer;
function toast(t) { $('toast').textContent=t; $('toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4000); }
function log(t) { events.push({at:new Date().toISOString(),message:t}); if(events.length>400)events.shift(); $('log').textContent=events.slice(-35).map(e=>`${e.at.slice(11,19)} ${e.message}`).join('\n'); $('log').scrollTop=$('log').scrollHeight; }
function message(t,error=false) { $('connectionMessage').textContent=t; $('connectionMessage').classList.toggle('error',error); }
function dimensions() {return [Math.max(32,Math.min(1024,Number($('width').value)||240)),Math.max(32,Math.min(1024,Number($('height').value)||284))];}
function draw(canvas,clock=false) {
  const [w,h]=dimensions(); canvas.width=w;canvas.height=h;
  const c=canvas.getContext('2d'), a=$('accent').value,b=$('background').value;
  c.fillStyle=b;c.fillRect(0,0,w,h);c.save();c.scale(w/240,h/284);
  if(photo){
    const scale=Math.max(240/photo.width,284/photo.height)*Number($('zoom').value);
    c.drawImage(photo,(240-photo.width*scale)/2,(284-photo.height*scale)/2,photo.width*scale,photo.height*scale);
    const shade=c.createLinearGradient(0,0,0,284);shade.addColorStop(0,'#00000033');shade.addColorStop(.5,'#00000000');shade.addColorStop(1,'#00000080');c.fillStyle=shade;c.fillRect(0,0,240,284);
  }else if(theme==='orbit'){
    const glow=c.createRadialGradient(33,215,0,33,215,205);glow.addColorStop(0,a+'44');glow.addColorStop(1,b);c.fillStyle=glow;c.fillRect(0,0,240,284);
    for(let r=70;r<300;r+=15){c.strokeStyle=a;c.globalAlpha=.12+(r%45)/100;c.lineWidth=r===115?2:0.75;c.beginPath();c.ellipse(-12,250,r,r*.85,-.5,0,Math.PI*2);c.stroke();}c.globalAlpha=1;c.fillStyle=a;c.beginPath();c.arc(182,215,3.5,0,Math.PI*2);c.fill();
  }else if(theme==='dune'){
    for(let i=0;i<7;i++){c.fillStyle=i%2?a:b;c.globalAlpha=.12+i*.07;c.beginPath();c.moveTo(-10,105+i*26);c.bezierCurveTo(75,170+i*23,170,48+i*24,250,120+i*28);c.lineTo(250,300);c.lineTo(-10,300);c.fill();}c.globalAlpha=1;
  }else if(theme==='wave'){
    c.strokeStyle=a;for(let i=0;i<26;i++){c.globalAlpha=.15+(i%7)*.08;c.lineWidth=1;c.beginPath();c.moveTo(-15,105+i*7);c.bezierCurveTo(80,210+i*7,140,50+i*8,260,140+i*8);c.stroke();}c.globalAlpha=1;
  }else{
    c.strokeStyle=a+'45';c.lineWidth=.6;c.strokeRect(18,18,204,248);c.fillStyle=a;c.fillRect(24,218,26,3);c.font='9px Cairo, Segoe UI';c.textAlign='left';c.fillText('LESS, BUT BETTER.',24,240);
  }
  const caption=$('caption').value.trim();if(caption){c.fillStyle=a;c.textAlign='center';c.font='600 14px Cairo, Segoe UI';c.direction='rtl';c.fillText(caption,120,$('captionPosition').value==='top'?29:261,196);}
  if(clock){const d=new Date();c.direction='ltr';c.textAlign='center';c.fillStyle='#f3f5ef';c.shadowColor='#0008';c.shadowBlur=10;c.font='600 49px Cairo, Segoe UI';c.fillText(d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),120,102);c.font='11px Cairo, Segoe UI';c.fillStyle=a;c.fillText(d.toLocaleDateString('en-US',{weekday:'short',day:'2-digit',month:'short'}).toUpperCase(),120,123);c.shadowBlur=0;}
  c.restore();
}
function render(){draw($('preview'),$('showClock').checked);$('resolution').textContent=dimensions().join(' × ');}
function download(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);}
function state(){return {schema:'fitpro-studio-design-v1',theme,accent:$('accent').value,background:$('background').value,caption:$('caption').value,captionPosition:$('captionPosition').value,width:dimensions()[0],height:dimensions()[1],zoom:Number($('zoom').value),photo:photoUrl};}
async function readPhoto(file){if(!file)return;if(file.size>12*1024*1024)throw Error('الصورة كبيرة؛ اختر صورة أقل من 12 ميجابايت.');if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('اختر صورة PNG أو JPG أو WebP.');const uri=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});await setPhoto(uri);}
async function setPhoto(uri){if(uri!==null&&!/^data:image\/(png|jpeg|webp);base64,/.test(uri))throw Error('صيغة الصورة غير مدعومة.');if(!uri){photo=null;photoUrl=null;$('photoControls').hidden=true;render();return;}const img=new Image();img.src=uri;await img.decode();if(img.width*img.height>40000000)throw Error('أبعاد الصورة كبيرة جدًا.');photo=img;photoUrl=uri;$('photoControls').hidden=false;render();}
function selectTheme(name){theme=name;for(const el of document.querySelectorAll('.preset'))el.classList.toggle('active',el.dataset.theme===name);}
for(const el of document.querySelectorAll('.preset'))el.onclick=()=>{selectTheme(el.dataset.theme);[$('accent').value,$('background').value]=presets[theme];setPhoto(null);};
for(const id of ['accent','background','caption','captionPosition','width','height','zoom','showClock'])$(id).addEventListener('input',render);
$('photo').onchange=()=>readPhoto($('photo').files[0]).catch(e=>toast(e.message));
$('removePhoto').onclick=()=>{$('photo').value='';setPhoto(null);};
$('export').onclick=()=>{const c=document.createElement('canvas');draw(c,false);c.toBlob(b=>{if(b){download(b,`LT10-${theme}-${c.width}x${c.height}.png`);toast('حُفظت الخلفية بدون وقت ثابت.');}},'image/png');};
$('saveProject').onclick=()=>download(new Blob([JSON.stringify(state(),null,2)],{type:'application/json'}),'watch-design.json');
$('loadProject').onchange=async()=>{try{const f=$('loadProject').files[0];if(!f)return;if(f.size>18*1024*1024)throw Error('ملف المشروع كبير جدًا.');const s=JSON.parse(await f.text());if(s.schema!=='fitpro-studio-design-v1'||!presets[s.theme]||!/^#[0-9a-f]{6}$/i.test(s.accent)||!/^#[0-9a-f]{6}$/i.test(s.background)||![s.width,s.height].every(n=>Number.isInteger(n)&&n>=32&&n<=1024)||!Number.isFinite(s.zoom)||s.zoom<1||s.zoom>3)throw Error('ملف المشروع غير صالح.');selectTheme(s.theme);for(const id of ['accent','background','width','height','zoom'])$(id).value=s[id];$('caption').value=String(s.caption||'').slice(0,28);$('captionPosition').value=s.captionPosition==='top'?'top':'bottom';await setPhoto(s.photo||null);render();toast('تم فتح المشروع.');}catch(e){toast(e.message);}finally{$('loadProject').value='';}};
function connected(){return !!selected?.gatt?.connected;}
function updateControls(){const on=connected();$('connect').disabled=busy||on;$('disconnect').disabled=busy||!on;$('inspect').disabled=busy||!on||!tx;$('find').disabled=busy||!on||!tx;$('status').textContent=on?'متصل بالبلوتوث':busy?'جارٍ الاتصال…':'غير متصل';$('status').classList.toggle('online',on);}
async function write(bytes){const run=async()=>{if(!connected()||!tx)throw Error('الساعة غير متصلة.');log(`TX ${hex(bytes)}`);if(tx.properties.write)await tx.writeValueWithResponse(bytes);else await tx.writeValueWithoutResponse(bytes);};const p=writeQueue.then(run);writeQueue=p.catch(()=>{});return p;}
function report(){return {app:'FitPro Studio',version:'0.1.0',createdAt:new Date().toISOString(),connected:connected(),deviceName:selected?.name||null,services:gattServices,identity,battery,dial:info,events,uploadSupported:false,reason:'Exact LJ737(D)/LT10 dial template and image encoding still require verification.'};}
async function saveLocalReport(){try{const response=await fetch('/report',{method:'POST',headers:{'Content-Type':'application/json','X-Studio-Token':document.querySelector('meta[name=studio-token]')?.content||''},body:JSON.stringify(report(),null,2)});if(!response.ok)throw Error('save failed');}catch{/* The explicit download button remains available. */}}
function packetReceived(packet){if(packet.ack)return;log(`RX ${hex(packet.raw)}`);if(packet.group===0x20&&packet.command===2){try{info=dialInfo(packet.payload);$('width').value=info.width;$('height').value=info.height;$('sizeNote').textContent='المقاس مقروء من الساعة.';$('screenInfo').textContent=`${info.width} × ${info.height}`;$('formatInfo').textContent=`رمز ${info.algorithm}${info.themeVersion!==undefined?' / v'+info.themeVersion:''}`;$('deviceDetail').textContent=info.model||info.hardware||'تمت قراءة الواجهة';$('transferReason').textContent='وصلت معلومات الشاشة. نحتاج مطابقة قالب هذا الموديل قبل تفعيل رفع التصميم مباشرة. احفظ تقرير الاتصال للمتابعة.';message('وصل رد الساعة، وتم ضبط مقاس التصميم.');render();}catch(e){log(`DIAL parse: ${e.message}`);message('وصل رد غير معروف. احفظ التقرير لتحديد صيغة الساعة.',true);}}
  if(packet.group===0x20||packet.group===0x1a)write(acknowledge(packet)).catch(e=>log(e.message));saveLocalReport();
}
const UARTS=['6e400001-b5a3-f393-e0a9-e50e24dcca9d','7e400001-b5a3-f393-e0a9-e50e24dcca9d'];
async function readIdentity(server){for(const [serviceId,chars] of [['battery_service',[['battery_level','battery']]],['device_information',[['model_number_string','model'],['firmware_revision_string','firmware'],['hardware_revision_string','hardware'],['manufacturer_name_string','manufacturer']]]]){try{const service=await server.getPrimaryService(serviceId);for(const [uuid,name]of chars){try{const c=await service.getCharacteristic(uuid),v=await c.readValue();if(name==='battery'){battery=v.getUint8(0);$('batteryInfo').textContent=`${battery}%`;}else identity[name]=new TextDecoder().decode(v).replace(/\0/g,'');}catch{}}}catch{}}}
async function inspect(){if(!tx)return;busy=true;updateControls();message('جارٍ طلب مقاس الشاشة وصيغة الواجهة…');const before=info;try{await write(frame(0x20,2));setTimeout(()=>{if(connected()&&info===before)message('لم يصل رد معلومات الواجهة. احفظ تقرير الاتصال؛ قد يحتاج هذا الإصدار خطوات تهيئة مختلفة.',true);},7000);}finally{busy=false;updateControls();}}
$('connect').onclick=async()=>{
  if(!navigator.bluetooth){message('هذا المتصفح لا يدعم اتصال الساعة. شغّل البرنامج باستخدام Microsoft Edge أو Chrome على ويندوز.',true);return;}
  busy=true;info=null;battery=null;identity={};gattServices=[];decoder=new Decoder();updateControls();
  try{
    selected=await navigator.bluetooth.requestDevice({filters:[{namePrefix:'LT'},{namePrefix:'LJ'},{namePrefix:'Fit'},{namePrefix:'fit'},{services:[UARTS[0]]},{services:[UARTS[1]]}],optionalServices:[...UARTS,'battery_service','device_information']});
    selected.addEventListener('gattserverdisconnected',()=>{tx=null;rx=null;info=null;$('screenInfo').textContent='—';$('batteryInfo').textContent='—';$('formatInfo').textContent='غير معروف';$('deviceDetail').textContent='انقطع الاتصال';$('transferReason').textContent='أعد الاتصال واقرأ معلومات الواجهة للمتابعة.';log('Disconnected');message('انقطع الاتصال. قرّب الساعة وتأكد أن FitPro لا يتصل بها.');updateControls();saveLocalReport();});
    $('deviceName').textContent=selected.name||'ساعة بدون اسم';message('جارٍ الاتصال وقراءة خدمات الساعة…');log(`Selected ${selected.name}`);
    const server=await selected.gatt.connect();
    for(const uuid of UARTS){try{const s=await server.getPrimaryService(uuid);const chars=await s.getCharacteristics();gattServices.push({uuid,characteristics:chars.map(c=>({uuid:c.uuid,read:c.properties.read,write:c.properties.write,writeWithoutResponse:c.properties.writeWithoutResponse,notify:c.properties.notify,indicate:c.properties.indicate}))});const writer=chars.find(c=>c.uuid===uuid.replace('0001-','0002-')&&(c.properties.write||c.properties.writeWithoutResponse));const receiver=chars.find(c=>c.uuid===uuid.replace('0001-','0003-')&&(c.properties.notify||c.properties.indicate));if(writer&&receiver){tx=writer;rx=receiver;break;}}catch(e){log(`Service ${uuid}: ${e.name}`);}}
    await readIdentity(server);
    if(!tx||!rx){message('تم اتصال البلوتوث لكن خدمة FitPro المعروفة غير موجودة. احفظ تقرير الاتصال.',true);$('deviceDetail').textContent='خدمة غير مدعومة';return;}
    rx.addEventListener('characteristicvaluechanged',event=>{const v=event.target.value,bytes=new Uint8Array(v.buffer,v.byteOffset,v.byteLength);for(const p of decoder.push(bytes))packetReceived(p);});await rx.startNotifications();
    $('deviceDetail').textContent='اتصال FitPro جاهز';log('Notifications enabled');message('تم الاتصال. جارٍ قراءة معلومات الواجهة.');await inspect();
  }catch(e){log(`${e.name}: ${e.message}`);message(e.name==='NotFoundError'?'لم يتم اختيار الساعة. شغّل شاشة الساعة وأوقف بلوتوث الأجهزة الأخرى ثم حاول مجددًا.':`تعذر الاتصال: ${e.message}`,true);if(selected?.gatt?.connected)selected.gatt.disconnect();}
  finally{busy=false;updateControls();saveLocalReport();}
};
$('inspect').onclick=()=>inspect().catch(e=>message(e.message,true));
$('disconnect').onclick=()=>selected?.gatt?.disconnect();
$('find').onclick=async()=>{busy=true;updateControls();try{await write(frame(0x12,0x0b,Uint8Array.of(1)));message('تم إرسال أمر الاهتزاز؛ تحقّق من الساعة.');}catch(e){message(e.message,true);}finally{busy=false;updateControls();saveLocalReport();}};
$('report').onclick=()=>{download(new Blob([JSON.stringify(report(),null,2)],{type:'application/json'}),'fitpro-connection-report.json');toast('تم حفظ تقرير الاتصال.');};
window.addEventListener('error',e=>{log(`UI error: ${e.message}`);});
window.addEventListener('unhandledrejection',e=>{log(`Error: ${e.reason?.message||e.reason}`);});
setInterval(()=>{render();fetch('/pulse').catch(()=>{});},15000);
log('Studio ready. No watch writes until connection / explicit commands.');render();updateControls();
