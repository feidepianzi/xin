export async function onRequestGet({env}){
  try{
    var v = await env.MY_KV.get("search_app_data_v2"), d;
    if(!v) d = {frontend:[], backend1:[], backend2:[]};
    else{
      try{ d = JSON.parse(v); }catch(e){ d = {frontend:[], backend1:[], backend2:[]}; }
      if(Array.isArray(d)) d = {frontend:d, backend1:[], backend2:[]};
    }
    return new Response(JSON.stringify(d), {
      headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}
    });
  }catch(e){
    return new Response(JSON.stringify({frontend:[],backend1:[],backend2:[]}), {
      status:200, headers:{"Content-Type":"application/json"}
    });
  }
}

export async function onRequestPost({request, env}){
  try{
    var body = await request.text(), d = JSON.parse(body);
    if(typeof d !== "object" || Array.isArray(d)) return new Response("Invalid format",{status:400});
    if(!Array.isArray(d.frontend)) d.frontend = [];
    if(!Array.isArray(d.backend1)) d.backend1 = [];
    if(!Array.isArray(d.backend2)) d.backend2 = [];
    await env.MY_KV.put("search_app_data_v2", JSON.stringify(d));
    return new Response("OK",{status:200});
  }catch(e){
    return new Response("ERROR:"+e.toString(),{status:500});
  }
}

export async function onRequestOptions(){
  return new Response(null, {
    headers:{
      "Access-Control-Allow-Origin":"*",
      "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":"Content-Type"
    }
  });
}
