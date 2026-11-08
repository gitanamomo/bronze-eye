from pathlib import Path
import math,random,base64
random.seed(7)
A=Path(__file__).resolve().parents[1]/'assets'
def defs():
 return '''<defs>
 <linearGradient id="stone" x2="0.7" y2="1"><stop stop-color="#334446"/><stop offset=".5" stop-color="#192b2d"/><stop offset="1" stop-color="#08151a"/></linearGradient>
 <linearGradient id="bronze" x2=".8" y2="1"><stop stop-color="#b59b63"/><stop offset=".22" stop-color="#586d58"/><stop offset=".48" stop-color="#253f39"/><stop offset=".65" stop-color="#84947a"/><stop offset=".78" stop-color="#465c49"/><stop offset="1" stop-color="#102b28"/></linearGradient>
 <linearGradient id="gold" x2=".6" y2="1"><stop stop-color="#ebd39a"/><stop offset=".4" stop-color="#89714a"/><stop offset="1" stop-color="#343e31"/></linearGradient>
 <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#263e3e"/><stop offset="1" stop-color="#070f15"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="#81e5cc" stop-opacity=".3"/><stop offset="1" stop-color="#61dbc7" stop-opacity="0"/></radialGradient>
 <radialGradient id="amber"><stop stop-color="#f4bc62" stop-opacity=".34"/><stop offset="1" stop-color="#e2a95b" stop-opacity="0"/></radialGradient>
 <radialGradient id="vignette"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#00060d" stop-opacity=".87"/></radialGradient>
 <filter id="texture"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".12"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
 <filter id="glow"><feGaussianBlur stdDeviation="5"/></filter>
 <pattern id="meander" width="48" height="32" patternUnits="userSpaceOnUse"><path d="M0 5H40V26H10V14H29V19H19M48 0V32" fill="none" stroke="#9d9871" stroke-width="2" opacity=".5"/></pattern>
 <g id="rune" fill="none" stroke="#b9b086" stroke-width="2"><path d="M-12-18V18M12-18V18M-12 0H12M-18-12L0-22 18-12M-7 8L0 16 7 8"/></g>
 <g id="sun" stroke="currentColor" fill="none" stroke-width="3"><circle r="14"/><circle r="5"/>'''+''.join(f'<path d="M{math.cos(i*math.pi/4)*21:.1f} {math.sin(i*math.pi/4)*21:.1f}l{math.cos(i*math.pi/4)*7:.1f} {math.sin(i*math.pi/4)*7:.1f}"/>' for i in range(8))+'''</g>
 <g id="bird" fill="none" stroke="currentColor" stroke-width="3"><path d="M-28-10Q-14-15 0 2Q7-15 26-17L15-1 28 4 6 10-5 22-3 7Q-18 3-28-10Z"/><path d="M12-8L25-23"/></g>
 <g id="branch" fill="none" stroke="currentColor" stroke-width="3"><path d="M0 26V-25M0-8L-19-23M0 6L20-12M0 17L-20 1M0-17L13-28"/><circle cy="-29" r="3"/></g>
 </defs>'''
def mask(x,y,s=1):
 return f'''<g transform="translate({x} {y}) scale({s})" filter="url(#texture)">
 <path d="M-213-130L-272-205-234-212-124-157Q0-210 124-157L234-212 272-205 213-130 245-90 230 92 180 152 73 184H-73L-180 152-230 92-245-90Z" fill="url(#bronze)" stroke="#9b9f76" stroke-width="3"/>
 <path d="M-184-87Q-109-129-32-72L-48-17Q-130-3-190-42ZM184-87Q109-129 32-72L48-17Q130-3 190-42Z" fill="#0a2425" stroke="#baad77" stroke-width="5"/>
 <path d="M-184-65Q-112-95-48-55M184-65Q112-95 48-55" fill="none" stroke="#5aa696" stroke-width="11"/>
 <path d="M-16-95L-39 64Q0 87 39 64L16-95M-48 89Q0 105 48 89L62 124Q0 150-62 124Z" fill="url(#gold)" stroke="#273a31" stroke-width="4"/>
 <path d="M-211-37L-210 85-157 125-92 130M211-37L210 85 157 125 92 130M-124-150L-115-124M124-150L115-124M-83-155Q0-188 83-155" fill="none" stroke="#b2a877" stroke-width="4"/>
 <path d="M-172 21h59v46h-39V42h20M172 21h-59v46h39V42h-20" fill="none" stroke="#9fa880" stroke-width="5"/>
 <g fill="none" stroke="#0e2c2a" stroke-width="8"><path d="M-229-113L-199-142M229-113L199-142M-81 170V150M81 170V150"/></g>
 <path d="M-16-153V-128M0-160V-120M16-153V-128" stroke="#c3b281" stroke-width="3"/>
 <ellipse cx="-113" cy="-53" rx="29" ry="10" fill="#9fe6c9" opacity=".8"/><ellipse cx="113" cy="-53" rx="29" ry="10" fill="#9fe6c9" opacity=".8"/>
 </g>'''
def pillar(x,w=105):
 return f'''<g filter="url(#texture)"><path d="M{x-18} 100H{x+w+18}L{x+w+6} 153H{x+w-3}V620L{x+w+28} 660H{x-28}L{x+3} 620V153H{x-6}Z" fill="url(#stone)" stroke="#58675c" stroke-width="2"/><path d="M{x+16} 158V612M{x+w-17} 158V612" stroke="#969476" opacity=".35"/><path d="M{x-14} 108H{x+w+14}V143H{x-14}ZM{x+8} 196H{x+w-8}V260H{x+8}ZM{x+8} 500H{x+w-8}V564H{x+8}Z" fill="url(#meander)"/>'''+''.join(f'<use href="#rune" transform="translate({x+w/2} {y}) scale(.65)" opacity=".35"/>' for y in range(300,480,55))+'</g>'
def lamp(x,y):
 return f'''<ellipse cx="{x}" cy="{y-35}" rx="130" ry="170" fill="url(#amber)"/><path d="M{x-28} {y}h56l-10 20h-36ZM{x-8} {y+20}h16v65h-16ZM{x-35} {y+85}h70v12h-70Z" fill="url(#bronze)" stroke="#998564"/><path d="M{x-14} {y}Q{x-32} {y-22} {x} {y-58}Q{x+2} {y-30} {x+15} {y-38}Q{x+34} {y-7} {x+14} {y}Z" fill="#dbac65"/><path d="M{x-8} {y}Q{x-14} {y-17} {x} {y-30}L{x+8} {y}Z" fill="#f8ecc3"/>'''
def base(n):
 out='<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">'+defs()+'<rect width="1600" height="900" fill="#071218"/>'
 out+='<path d="M0 0H1600V620H0Z" fill="url(#stone)" filter="url(#texture)"/>'
 for i in range(13):
  y=60+i*45
  out+=f'<path d="M0 {y}H1600" stroke="#60726b" opacity=".13"/>'
  for x in range((i%2)*100,1600,200):out+=f'<path d="M{x} {y}v45" stroke="#000" opacity=".22"/>'
 out+='<path d="M0 600H1600V900H0Z" fill="url(#floor)" filter="url(#texture)"/>'
 for x in range(-2000,4000,230): out+=f'<path d="M800 530L{x} 900" stroke="#6b8076" opacity=".16"/>'
 for y in [618,654,707,785,895]:out+=f'<path d="M0 {y}H1600" stroke="#7e8a79" opacity=".16"/>'
 out+='<ellipse cx="800" cy="762" rx="520" ry="102" fill="none" stroke="#9b9765" opacity=".3" stroke-width="2"/><ellipse cx="800" cy="762" rx="492" ry="92" fill="none" stroke="#657b68" opacity=".4"/>'
 return out
def finish(s,n):
 # fractures, hanging roots and foreground
 for i in range(42):
  x=random.randint(30,1570);y=random.randint(140,550)
  s+=f'<path d="M{x} {y}l-8 20 11 14-5 19" fill="none" stroke="#030e12" stroke-width="1.5" opacity=".4"/>'
 for x in [30,70,1470,1530]:
  s+=f'<path d="M{x} 0q-60 110 10 180t-20 180" fill="none" stroke="#182d29" stroke-width="13"/><path d="M{x} 0q-58 110 12 180t-20 180" fill="none" stroke="#667458" stroke-width="2" opacity=".35"/>'
 s+='<path d="M0 824l120-35 44 39 94 31 70 41H0ZM1600 789l-101-20-60 68-120 63h281Z" fill="#040c12"/><path d="M0 840l115-32 41 29M1600 806l-99-20-43 52" fill="none" stroke="#435449" opacity=".4"/>'
 s+='<rect width="1600" height="900" fill="url(#vignette)"/></svg>'
 (A/f'scene-{n}.svg').write_text(s)
s=base(0)
s+='<path d="M497 600V180Q800-84 1103 180V600Z" fill="#08191d" stroke="#737861" stroke-width="14"/><path d="M523 600V190Q800-46 1077 190V600" fill="none" stroke="url(#bronze)" stroke-width="24"/><path d="M550 600V207Q800-10 1050 207V600" fill="none" stroke="#a49668" opacity=".45" stroke-width="2"/><ellipse cx="800" cy="300" rx="340" ry="315" fill="url(#halo)"/>'
s+=mask(800,304,.76)
s+='<path d="M696 595V480H904V595" fill="url(#bronze)" stroke="#737b5b" stroke-width="3"/><path d="M800 487V595" stroke="#0b2324" stroke-width="5"/>'
for i,g in enumerate(['sun','bird','branch']):s+=f'<use href="#{g}" transform="translate({745+i*55} 535) scale(.6)" color="#c6ba85"/>'
s+=pillar(177)+pillar(1318)+lamp(437,501)+lamp(1163,501)
s+='<g filter="url(#texture)"><path d="M310 620V407L340 365H424L451 403V620Z" fill="url(#stone)" stroke="#849082" stroke-width="3"/><path d="M325 605V418L346 386H413L435 416V605Z" fill="none" stroke="#9a9b77" opacity=".5"/></g>'
for i,g in enumerate(['sun','bird','branch']): s+=f'<use href="#{g}" transform="translate(381 {430+i*67}) scale(.6)" color="#c1b484"/>'
s+='<g transform="translate(1190 375)" fill="none" stroke="#b9a36e" opacity=".6" stroke-width="3"><circle cx="50" cy="40" r="28"/><path d="M0 118Q50 45 104 118M50 118V155M50 145L15 127M50 135L83 113"/><use href="#bird" transform="translate(102 68) scale(.7)"/></g><path d="M1094 371H1350V567H1094Z" fill="none" stroke="url(#bronze)" stroke-width="13"/><path d="M532 641h114v20H532Z" fill="url(#bronze)"/><path d="M558 639l-13-45 48 10 17 35Z" fill="url(#bronze)" stroke="#7f9b80" stroke-width="3"/>'
finish(s,0)
s=base(1)
s+='<ellipse cx="800" cy="330" rx="650" ry="440" fill="url(#halo)"/><path d="M620 0L350 650H1030L880 0Z" fill="#9cdec5" opacity=".055"/><path d="M892 0L760 600H1130L940 0Z" fill="#c3e8d3" opacity=".04"/><path d="M620 624H980L1060 677H540Z" fill="url(#stone)" stroke="#7b8161" stroke-width="2"/><ellipse cx="800" cy="620" rx="180" ry="31" fill="url(#bronze)"/>'
# intricate tree branching, each a curved bronze sculptural branch
s+='<g filter="url(#texture)" fill="none" stroke-linecap="round"><path d="M800 620Q760 490 806 365Q830 230 800 104" stroke="#0a2220" stroke-width="58"/><path d="M800 620Q760 490 806 365Q830 230 800 104" stroke="url(#bronze)" stroke-width="43"/><path d="M795 616Q775 474 812 353Q830 230 800 107" stroke="#b9b07d" opacity=".7" stroke-width="5"/>'
for level in range(4):
 y=520-level*106
 for side in [-1,1]:
  span=240-level*37;x=800+side*span
  s+=f'<path d="M800 {y}Q{x} {y+25} {x} {y-68}Q{x} {y-110} {x-side*35} {y-124}" stroke="#102b28" stroke-width="28"/><path d="M800 {y}Q{x} {y+25} {x} {y-68}Q{x} {y-110} {x-side*35} {y-124}" stroke="url(#bronze)" stroke-width="19"/><path d="M800 {y-5}Q{x-side*10} {y+15} {x-4} {y-68}" stroke="#b5ac73" stroke-width="3"/>'
  s+=f'<use href="#bird" transform="translate({x} {y-95}) scale({side*1.1} 1.1)" color="#c4b97d"/><circle cx="{x-side*35}" cy="{y-122}" r="12" fill="url(#gold)"/>'
s+='</g><use href="#sun" transform="translate(800 98) scale(1.8)" color="#decb8d"/>'
for x in [435,800,1165]:
 s+=f'<path d="M{x-56} 650v-85q56-45 112 0v85Z" fill="url(#bronze)" stroke="#a49b70" stroke-width="2"/><ellipse cx="{x}" cy="570" rx="38" ry="25" fill="#102d2c" stroke="#8eab8d" stroke-width="3"/>'
for x,g in zip([435,800,1165],['sun','bird','branch']):s+=f'<use href="#{g}" transform="translate({x} 570) scale(.64)" color="#c9c693"/>'
s+=pillar(145,80)+pillar(1375,80)+lamp(290,500)+lamp(1310,500)
for i in range(30):
 x=random.choice([random.randint(200,370),random.randint(1230,1430)]);y=random.randint(450,630)
 s+=f'<path d="M{x} 655q-40-45-20-{655-y}q35 8 20 {655-y}" fill="#24473a" stroke="#607352" stroke-width="1"/>'
s+='<path d="M1050 376h155v115h-155Z" fill="url(#stone)" stroke="#7f9072"/><g color="#bdb68b"><use href="#sun" transform="translate(1075 405) scale(.4)"/><use href="#bird" transform="translate(1075 435) scale(.4)"/><use href="#branch" transform="translate(1075 466) scale(.4)"/></g>'
for y,count in [(405,3),(435,2),(466,4)]:
 for j in range(count):s+=f'<circle cx="{1111+j*19}" cy="{y}" r="4" fill="#adb88e"/>'
finish(s,1)
s=base(2)
s+='<path d="M300 600V200Q800-200 1300 200V600" fill="#07151c" stroke="#3e5552" stroke-width="26"/><ellipse cx="800" cy="330" rx="550" ry="410" fill="url(#amber)"/>'
for r in [228,254,282]:s+=f'<circle cx="800" cy="314" r="{r}" fill="none" stroke="#a49863" opacity=".4" stroke-width="2"/>'
for i in range(20):
 ang=i*math.tau/20
 s+=f'<use href="#rune" transform="translate({800+math.cos(ang)*268:.1f} {314+math.sin(ang)*268:.1f}) rotate({i*18+90}) scale(.55)" opacity=".6"/>'
s+=mask(800,317,.83)
s+='<ellipse cx="800" cy="659" rx="260" ry="48" fill="#041216"/><path d="M520 672Q800 570 1080 672V699Q800 810 520 699Z" fill="url(#bronze)" stroke="#8a8c60" stroke-width="3"/><ellipse cx="800" cy="672" rx="280" ry="57" fill="url(#stone)" stroke="#a69e70" stroke-width="3"/><ellipse cx="800" cy="672" rx="224" ry="40" fill="none" stroke="#8c9f80" opacity=".55" stroke-width="2"/>'
s+=pillar(164,85)+pillar(1350,85)+lamp(367,504)+lamp(1233,504)
s+='<path d="M350 410h120v170H350Z" fill="url(#bronze)" stroke="#a9a278"/><use href="#branch" transform="translate(410 448) scale(.5)" color="#c3be8b"/><use href="#bird" transform="translate(410 492) scale(.5)" color="#c3be8b"/><use href="#sun" transform="translate(410 537) scale(.5)" color="#c3be8b"/><path d="M1120 429h115v150h-115Z" fill="url(#stone)" stroke="#8e9575"/><path d="M1140 470q38-35 75 0q-38 30-75 0ZM1140 523q38-35 75 0q-38 30-75 0Z" fill="none" stroke="#b9b18a" stroke-width="2"/>'
finish(s,2)
# Reference extracted into independent silhouette layers, no background or base.
head='M122 837 C108 763 111 695 120 625 C111 522 134 396 188 307 C175 276 194 237 226 237 C272 195 346 173 428 168 C495 160 547 174 586 205 C660 220 706 282 707 364 C722 425 705 480 711 535 C735 615 729 692 742 765 C755 828 745 919 714 965 L657 1036 L599 1056 L565 1009 L558 890 L573 831 C501 866 405 851 354 823 L330 866 L331 1003 L287 1107 C219 1116 154 1071 139 1006 C119 950 132 903 122 837Z'
body='M352 848 Q404 857 452 856 L530 858 L574 900 L601 965 L656 988 L691 1034 L685 1098 L648 1137 L615 1134 L620 1246 L596 1385 L610 1421 L597 1453 Q552 1475 510 1450 L489 1430 L455 1453 Q394 1476 363 1450 L355 1429 L375 1398 L377 1268 L337 1222 L279 1201 L266 1157 L284 1090 L305 1050 L296 1019 L307 969 L321 911Z'
for name,path in [('head',head),('body',body)]:
 encoded='data:image/png;base64,'+base64.b64encode((A/'linyue-reference.png').read_bytes()).decode()
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="90 150 680 1330"><defs><clipPath id="cut"><path d="{path}"/></clipPath></defs><image href="{encoded}" xlink:href="{encoded}" width="941" height="1672" clip-path="url(#cut)"/></svg>'
 (A/f'linyue-{name}.svg').write_text(svg)
print('Created three original scene illustrations and two clipped character layers.')
