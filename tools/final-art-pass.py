from pathlib import Path
import xml.etree.ElementTree as ET
A=Path(__file__).resolve().parents[1]/'assets'
# Separate suspended mask from masonry so it can move independently.
p=A/'scene-2.svg';root=ET.fromstring(p.read_text());ns='{http://www.w3.org/2000/svg}'
mask=next((e for e in root if e.tag==ns+'g' and e.get('transform')=='translate(800 317) scale(0.83)'),None)
if mask is not None:
 layer=ET.Element(ns+'svg',{'viewBox':'0 0 1600 900','width':'1600','height':'900'});layer.append(root.find(ns+'defs'));layer.append(mask);root.remove(mask)
 ET.register_namespace('','http://www.w3.org/2000/svg');ET.ElementTree(layer).write(A/'floating-mask.svg',encoding='unicode');ET.ElementTree(root).write(p,encoding='unicode')
# Patinated ceremonial disc creates a distinct recessed depth behind the tree.
p=A/'scene-1.svg';s=p.read_text();mark='<ellipse cx="800" cy="330"'
i=s.index(mark);disc='<g fill="none" stroke="#9a9a70" opacity=".2"><circle cx="800" cy="326" r="279" stroke-width="12"/><circle cx="800" cy="326" r="258" stroke-width="2"/><path d="M800 35V602M510 326H1090M595 121L1005 531M595 531L1005 121" stroke-width="1"/></g>'
s=s[:i]+disc+s[i:];p.write_text(s)
print('Visual pass 2: recessed tree disc and independent suspended mask.')
