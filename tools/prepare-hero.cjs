// Normalize the generated character frames without changing their illustration.
const fs=require('node:fs'),path=require('node:path');let sharp;try{sharp=require('sharp')}catch{sharp=require(process.env.SHARP_MODULE_PATH||'/Users/gitana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')}
const root=path.resolve(__dirname,'..'),base=root+'/assets/hero',CW=384,CH=752,BASELINE=744;
(async()=>{const manifest={cellWidth:CW,cellHeight:CH,baseline:BASELINE,columns:4,rows:2,frames:{}};
for(const sheet of ['poses','walk']){
 const file=`${base}/source/${sheet}-clean.png`,{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const frames=[];
 for(let n=0;n<8;n++){
  const col=n%4,row=Math.floor(n/4),x0=Math.round(col*info.width/4),x1=Math.round((col+1)*info.width/4),y0=Math.round(row*info.height/2),y1=Math.round((row+1)*info.height/2);
  let minX=x1,minY=y1,maxX=x0,maxY=y0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(data[(y*info.width+x)*4+3]>64){minX=Math.min(x,minX);maxX=Math.max(x,maxX);minY=Math.min(y,minY);maxY=Math.max(y,maxY)}
  if(maxX<=minX||maxY<=minY)throw Error('Empty sprite '+sheet+n);
  let sum=0,weightedX=0;
  const headTop=minY+Math.round((maxY-minY)*.06),headBottom=minY+Math.round((maxY-minY)*.31);
  for(let y=headTop;y<headBottom;y++)for(let x=minX;x<=maxX;x++){const a=data[(y*info.width+x)*4+3];if(a>80){sum+=a;weightedX+=x*a}}
  const anchorX=sum?weightedX/sum:(minX+maxX)/2;
  minX=Math.max(x0,minX-3);minY=Math.max(y0,minY-3);maxX=Math.min(x1-1,maxX+3);maxY=Math.min(y1-1,maxY+3);
  frames.push({frame:n,source:{left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1},anchorX});
 }
 const heights=frames.map(f=>f.source.height).sort((a,b)=>a-b),scale=694/((heights[3]+heights[4])/2);
 fs.mkdirSync(`${base}/${sheet}`,{recursive:true});
 for(const f of frames){const w=Math.round(f.source.width*scale),h=Math.round(f.source.height*scale),left=Math.round(CW/2-(f.anchorX-f.source.left)*scale),top=BASELINE-h;
  if(left<0||left+w>CW||top<0)throw Error(`Sprite exceeds cell: ${sheet}/${f.frame} ${left},${top},${w},${h}`);
  const sprite=await sharp(file).extract(f.source).resize(w,h).png().toBuffer();
  await sharp({create:{width:CW,height:CH,channels:4,background:'#00000000'}}).composite([{input:sprite,left,top}]).webp({quality:95,alphaQuality:100}).toFile(`${base}/${sheet}/${f.frame}.webp`);
  Object.assign(f,{width:w,height:h,left,top,scale,baseline:BASELINE});
 }
 manifest.frames[sheet]=frames;
}
fs.writeFileSync(base+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log('Prepared eight walk and eight expressive poses.');})();
