/* Tiny DOM helper. el('div.card', { id:'x' }, child, 'text') */
export function el(spec, attrs, ...children) {
  let tag = 'div', id = null; const classes = [];
  for (const part of spec.split(/(?=[.#])/)) {
    if (part[0] === '#') id = part.slice(1);
    else if (part[0] === '.') classes.push(part.slice(1));
    else if (part) tag = part;
  }
  const node = document.createElement(tag);
  if (id) node.id = id;
  if (classes.length) node.className = classes.join(' ');
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'html') node.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') {
      for (const [sk, sv] of Object.entries(v)) {
        if (sk.startsWith('--')) node.style.setProperty(sk, sv); else node.style[sk] = sv;
      }
    }
    else if (k in node && k !== 'list') { try { node[k] = v; } catch { node.setAttribute(k, v); } }
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}
