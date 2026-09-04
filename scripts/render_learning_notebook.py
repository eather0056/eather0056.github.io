#!/usr/bin/env python3
import argparse, base64, html, json, re
from pathlib import Path
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import PythonLexer

def inline(text, asset_prefix):
    text=html.escape(text)
    text=re.sub(r'!\[([^]]*)\]\(([^)]+)\)',lambda m:f'<img class="notebook-animation" src="{asset_prefix}/{html.escape(m.group(2))}" alt="{m.group(1)}" loading="lazy">',text)
    text=re.sub(r'\[([^]]+)\]\((https?://[^)]+)\)',r'<a href="\2" target="_blank" rel="noreferrer">\1</a>',text)
    text=re.sub(r'`([^`]+)`',r'<code>\1</code>',text)
    text=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',text)
    text=re.sub(r'(?<!\*)\*([^*\n]+)\*(?!\*)',r'<em>\1</em>',text)
    return text

def markdown_to_html(source,asset_prefix):
    lines=source.splitlines(); out=[]; i=0; paragraph=[]
    def flush():
        nonlocal paragraph
        if paragraph: out.append('<p>'+inline(' '.join(x.strip() for x in paragraph),asset_prefix)+'</p>'); paragraph=[]
    while i<len(lines):
        line=lines[i]
        if not line.strip(): flush(); i+=1; continue
        if re.match(r'^#{1,6} ',line):
            flush(); marks,title=line.split(' ',1); level=min(len(marks)+1,6); anchor=re.sub(r'[^a-z0-9]+','-',title.lower()).strip('-'); out.append(f'<h{level} id="{anchor}">{inline(title,asset_prefix)}</h{level}>'); i+=1; continue
        if line.startswith('|') and i+1<len(lines) and re.match(r'^\|?\s*:?-+',lines[i+1]):
            flush(); rows=[]
            while i<len(lines) and lines[i].startswith('|'): rows.append([x.strip() for x in lines[i].strip('|').split('|')]); i+=1
            headers=rows[0]; body=rows[2:]; out.append('<div class="notebook-table-wrap"><table><thead><tr>'+''.join(f'<th>{inline(x,asset_prefix)}</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join(f'<td>{inline(x,asset_prefix)}</td>' for x in row)+'</tr>' for row in body)+'</tbody></table></div>'); continue
        if re.match(r'^\s*[-*] ',line):
            flush(); items=[]
            while i<len(lines) and re.match(r'^\s*[-*] ',lines[i]): items.append(re.sub(r'^\s*[-*] ','',lines[i])); i+=1
            out.append('<ul>'+''.join(f'<li>{inline(x,asset_prefix)}</li>' for x in items)+'</ul>'); continue
        if re.match(r'^\s*\d+\. ',line):
            flush(); items=[]
            while i<len(lines) and re.match(r'^\s*\d+\. ',lines[i]): items.append(re.sub(r'^\s*\d+\. ','',lines[i])); i+=1
            out.append('<ol>'+''.join(f'<li>{inline(x,asset_prefix)}</li>' for x in items)+'</ol>'); continue
        if re.match(r'^\s*!\[',line): flush(); out.append(inline(line.strip(),asset_prefix)); i+=1; continue
        paragraph.append(line); i+=1
    flush(); return '\n'.join(out)

def render(notebook_path,output_path,title,asset_prefix):
    notebook_path=Path(notebook_path); nb=json.loads(notebook_path.read_text()); output_dir=notebook_path.parent/'outputs'; output_dir.mkdir(exist_ok=True); cells=[]; execution=1
    for index,cell in enumerate(nb['cells']):
        source=''.join(cell.get('source',[]))
        if cell['cell_type']=='markdown': cells.append(f'<section class="nb-markdown">{markdown_to_html(source,asset_prefix)}</section>'); continue
        code=highlight(source,PythonLexer(),HtmlFormatter(nowrap=True)); outputs=[]
        for j,out in enumerate(cell.get('outputs',[])):
            kind=out.get('output_type'); data=out.get('data',{})
            if kind in ('display_data','execute_result') and 'image/png' in data:
                filename=f'cell-{index:02d}-output-{j}.png'; (output_dir/filename).write_bytes(base64.b64decode(data['image/png'])); outputs.append(f'<img src="{asset_prefix}/outputs/{filename}" alt="Output plot from code cell {execution}" loading="lazy">')
            elif kind in ('display_data','execute_result') and 'text/plain' in data: outputs.append('<pre>'+html.escape(''.join(data['text/plain']))+'</pre>')
            elif kind=='stream': outputs.append('<pre>'+html.escape(''.join(out.get('text',[])))+'</pre>')
            elif kind=='error': outputs.append('<pre class="nb-error">'+html.escape('\n'.join(out.get('traceback',[])))+'</pre>')
        output_html='<div class="nb-output"><span>Out</span>'+''.join(outputs)+'</div>' if outputs else ''
        cells.append(f'<section class="nb-code-cell"><div class="nb-prompt">In&nbsp;[{execution}]</div><pre class="nb-code"><code>{code}</code></pre>{output_html}</section>'); execution+=1
    body='\n'.join(cells)
    page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Interactive robot state-estimation notebook by Md Ether Deowan."><title>{html.escape(title)} | Md Ether Deowan</title><link rel="stylesheet" href="assets/css/styles.css"><script src="assets/js/main.js" defer></script><script>window.MathJax={{tex:{{inlineMath:[["$","$"],["\\\\(","\\\\)"]]}},svg:{{fontCache:"global"}}}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script></head><body data-page="learning"><a class="skip-link" href="#main-content">Skip to content</a><header id="site-header"></header><main id="main-content"><div class="notebook-shell"><div class="notebook-toolbar"><a href="learning.html">← Learning</a><span>Jupyter notebook</span><a href="{asset_prefix}/kalman_filter_robot_lab.ipynb" download>Download .ipynb</a></div><article class="notebook-page">{body}</article></div></main><footer id="site-footer"></footer></body></html>'''
    Path(output_path).write_text(page)

if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('notebook'); parser.add_argument('output'); parser.add_argument('--title',required=True); parser.add_argument('--asset-prefix',required=True); args=parser.parse_args(); render(args.notebook,args.output,args.title,args.asset_prefix)
