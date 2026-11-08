'use strict';
(() => {
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  class PaintedHero {
    constructor(player) {
      this.player=player;
      this.figure=player.querySelector('.figure');
      this.image=player.querySelector('.hero-frame');
      this.ghost=player.querySelector('.hero-ghost');
      this.tint=player.querySelector('.hero-tint');
      this.shade=player.querySelector('.shadow');
      this.cache=new Map();
      this.failed=[];
      const tasks=[];
      for(const sheet of ['poses','walk'])for(let frame=0;frame<8;frame++){
        const src=`assets/hero/${sheet}/${frame}.webp`,image=new Image();image.src=src;this.cache.set(src,image);
        tasks.push(image.decode().catch(()=>this.failed.push(src)));
      }
      this.ready=Promise.all(tasks);
      this.sheet='';this.frame=-1;this.flip=1;this.ghostFor=0;this.eventFor=0;this.event='';this.age=0;this.phase=0;this.idleAge=0;this.last=null;this.scene=-1;this.brightness=1;this.wasMoving=false;
    }
    reset(x,y,scene) {
      this.last={x,y};this.scene=scene;this.phase=0;this.idleAge=0;this.age=0;this.eventFor=0;this.ghostFor=0;this.wasMoving=false;this.image.style.opacity='1';
      this.show('poses',0,1,true);
    }
    react(kind) {
      this.event=kind;
      this.eventFor=kind==='wonder'?6:kind==='pet'?2.4:kind==='curious'?1.85:1.25;
    }
    show(sheet,frame,flip,snap=false) {
      if(sheet===this.sheet&&frame===this.frame&&flip===this.flip)return;
      const src=`assets/hero/${sheet}/${frame}.webp`,cached=this.cache.get(src);
      if(!cached||!cached.complete||cached.naturalWidth===0)return;
      const poseShift=sheet==='poses'&&this.sheet==='poses'&&frame!==this.frame&&frame!==1&&this.frame!==1&&!(frame>=4&&frame<=5&&this.frame>=4&&this.frame<=5);
      if(!snap&&this.sheet&&(sheet!==this.sheet||flip!==this.flip||poseShift)){
        this.ghost.src=this.image.src;this.ghost.style.transform=`scaleX(${this.flip})`;this.ghostFor=poseShift?.09:.12;
      }
      this.sheet=sheet;this.frame=frame;this.flip=flip;
      this.image.src=src;this.image.style.transform=`scaleX(${flip})`;
      this.tint.style.setProperty('--hero-mask',`url("${src}")`);
      this.tint.style.transform=`scaleX(${flip})`;
      this.player.dataset.heroSheet=sheet;this.player.dataset.heroFrame=String(frame);
    }
    update(dt,time,{x,y,scene,facing,mode,flash,nearClue=false,petDist=999}) {
      if(!this.last||scene!==this.scene)this.reset(x,y,scene);
      if(mode==='pause')return;
      this.age+=dt;this.eventFor=Math.max(0,this.eventFor-dt);this.ghostFor=Math.max(0,this.ghostFor-dt);
      const travel=Math.hypot(x-this.last.x,y-this.last.y);
      this.last={x,y};
      const moving=mode==='play'&&travel>.07&&travel<30;
      let action='idle',frame=0,sheet='poses';
      if(moving){
        this.idleAge=0;this.phase+=travel/150*8;sheet='walk';frame=Math.floor(this.phase)%8;action='walk';
      }else{
        if(this.wasMoving&&nearClue&&this.eventFor<=0){this.event='curious';this.eventFor=1.15;}
        this.idleAge+=dt;
        if(this.player.classList.contains('investigating')){frame=this.eventFor>.75?3:(Math.floor(this.age*1.4)%2?4:5);action='investigate'}
        else if(this.eventFor>0){frame=this.event==='pet'?6:this.event==='wonder'?7:this.event==='curious'?2:3;action=this.event}
        else if(this.idleAge%4.6>4.30&&this.idleAge%4.6<4.46){frame=1;action='blink'}
        else if(nearClue&&this.idleAge>.22&&this.idleAge<2.6){frame=2;action='curious'}
        else if(this.idleAge>5.6){
          const beat=this.idleAge%9.6;
          if(beat>1.0&&beat<2.5){frame=petDist<138?6:2;action=petDist<138?'pet':'curious'}
          else if(beat>5.2&&beat<6.6&&scene>0){frame=7;action='wonder'}
        }
      }
      this.wasMoving=moving;
      this.show(sheet,frame,facing||1);
      this.player.dataset.heroAction=action;
      // Subtle breathing when still and micro-cadence when walking; stride comes from the 8 frames.
      const breath=!moving?Math.sin(time*.0019)*.48:Math.sin(this.phase*Math.PI/2)*-.42;
      this.image.style.translate=`0 ${breath}px`;
      this.tint.style.translate=`0 ${breath}px`;
      this.ghost.style.opacity=String(clamp(this.ghostFor/.12,0,1)*.5);
      const sunCentre=scene===0?1120:scene===1?790:500;
      const sun=Math.exp(-Math.pow((x-sunCentre)/360,2));
      const desired=(scene===2?.93:.96)+sun*.065+(flash?.016:0);
      this.brightness+=(desired-this.brightness)*(1-Math.exp(-4*dt));
      this.figure.style.setProperty('--hero-brightness',this.brightness.toFixed(3));
      this.tint.style.opacity=String((scene===1?.15:.10)+sun*.035);
      this.tint.style.background=scene===2?'linear-gradient(140deg,#edc18585,transparent 45%,#5ec8bf7a)':'linear-gradient(135deg,#e9cf8c55,transparent 48%,#66a58b85)';
      const stride=moving?Math.abs(Math.sin(this.phase*Math.PI/4)):0;
      this.shade.style.width=`${moving?80+stride*14:66}px`;
      this.shade.style.opacity=String(.24+sun*.05);
    }
    snapshot(){return{sheet:this.sheet,frame:this.frame,action:this.player.dataset.heroAction,phase:this.phase,scene:this.scene,failed:[...this.failed],brightness:this.brightness}}
  }
  window.PaintedHero=PaintedHero;
})();
