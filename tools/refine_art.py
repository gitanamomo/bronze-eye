from pathlib import Path
import math,random
A=Path(__file__).resolve().parents[1]/'assets'
random.seed(31)
for scene in range(3):
 p=A/f'scene-{scene}.svg';s=p.read_text()
 # Crisp metal variation and intentionally restrained stone grain.
 s=s.replace('slope=".12"','slope=".045"')
 s=s.replace('<stop stop-color="#b59b63"/>','<stop stop-color="#e0c78d"/>').replace('<stop offset=".22" stop-color="#586d58"/>','<stop offset=".18" stop-color="#9a9b71"/><stop offset=".24" stop-color="#35574a"/>')
 s=s.replace('<stop stop-color="#334446"/>','<stop stop-color="#526159"/>')
 # Insert architectural depth BEFORE the scene props.
 marker='<path d="M0 600H1600V900H0Z"'
 idx=s.index(marker)
 arch=''
 for x in [40,1450]:
  arch+=f'<path d="M{x} 600V185q50-105 100 0v415" fill="#061419" stroke="#61745d" stroke-width="3" opacity=".8"/><path d="M{x+15} 600V200q35-70 70 0v400" fill="none" stroke="#9da77b" opacity=".2"/>'
 for x in [300,1230]:
  arch+=f'<path d="M{x} 104h70v12h-70Zm0 18h70v10h-70Z" fill="#9a9668" opacity=".25"/>'
 arch+='<path d="M0 62Q800 145 1600 62M0 84Q800 167 1600 84" fill="none" stroke="#9c9772" stroke-width="2" opacity=".24"/>'
 s=s[:idx]+arch+s[idx:]
 # Floor tiles with weathered small bronze inlays and cracks.
 inserts=''
 for j in range(25):
  x=random.randint(270,1330);y=random.randint(685,865)
  inserts+=f'<path d="M{x} {y}l25 4-14 5 34 3" fill="none" stroke="#648879" opacity=".18"/>'
 for j in range(36):
  a=j*math.tau/36;x=800+math.cos(a)*480;y=762+math.sin(a)*89
  inserts+=f'<path d="M{x-4:.1f} {y-2:.1f}l7 2-7 2" fill="none" stroke="#bdaf76" opacity=".4"/>'
 # Architectural broken cornice and foreground carved stone, organic moss.
 inserts+='<path d="M0 713L123 703l54 13-4 13-173 7ZM1420 737l88-32 92 23v24l-81-22-99 29Z" fill="#152a2c" stroke="#65715b" stroke-width="2"/>'
 for side in [0,1]:
  for j in range(28):
   x=random.randint(25,235)+(1330 if side else 0);y=random.randint(650,790)
   inserts+=f'<path d="M{x} {y}q-7-24-19-27q-6 22 19 27q8-29 23-27q-2 20-23 27" fill="#1f4235" stroke="#526744" stroke-width=".6" opacity=".8"/>'
 # Bronze mask embossed concentric ornament. Local coords of mask.
 if scene in [0,2]:
  sc=.76 if scene==0 else .83;cy=304 if scene==0 else 317
  ornament=f'<g transform="translate(800 {cy}) scale({sc})" fill="none" stroke="#c7ba83" opacity=".5">'
  for side in [-1,1]:
   for row in range(3):
    for col in range(4):
     x=side*(93+col*28);y=73+row*18
     ornament+=f'<path d="M{x} {y}h{side*15}v12h{-side*10}v-6h{side*5}" stroke-width="1.2"/>'
   ornament+=f'<path d="M{side*208}-102l{side*-19}-23M{side*215}-90l{side*-19}-23M{side*219}-76l{side*-19}-23" stroke-width="2"/>'
   for j in range(6):
    x=side*(55+j*21);y=-146+j*4
    ornament+=f'<circle cx="{x}" cy="{y}" r="3"/><path d="M{x-4} {y-7}v-8h8v8"/>'
  ornament+='<path d="M-35 110Q0 120 35 110M-28 117Q0 125 28 117M-10-73V52M9-73V52" stroke-width="1.5"/></g>'
  inserts+=ornament
 # Subtle ceiling rays, restricted to a single motivated light source.
 inserts+='<path d="M988-30L613 688H793L1015-30Z" fill="#cfe1ad" opacity=".035"/><path d="M1012-30L973 644H1092L1029-30Z" fill="#cfe1ad" opacity=".02"/>'
 s=s.replace('<rect width="1600" height="900" fill="url(#vignette)"/>',inserts+'<rect width="1600" height="900" fill="url(#vignette)"/>')
 p.write_text(s)
print('Visual refinement pass 1: relief engraving, stone depth, floor patina, foliage and directional rays.')
