const DB_NAME='ghostfolio-media';
const STORE_NAME='files';
function openDatabase(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,1);
    request.onupgradeneeded=()=>request.result.createObjectStore(STORE_NAME,{keyPath:'id'});
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
export async function saveMedia(file){
  const db=await openDatabase(),id=`media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE_NAME,'readwrite');
    tx.objectStore(STORE_NAME).put({id,blob:file,name:file.name,type:file.type});
    tx.oncomplete=()=>resolve(id);tx.onerror=()=>reject(tx.error);
  });
}
export async function getMedia(id){
  if(!id)return null;
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).get(id);
    request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error);
  });
}
export async function deleteMedia(id){
  if(!id)return;
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
}
export async function clearMedia(){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).clear();
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
}

