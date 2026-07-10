const JsonViewer = {
  container: null,
  data: null,
  searchHits: [],
  currentSearchIndex: -1,
  hasSearched: false,
  lastSearchKeyword: '',
  INDENT: 18,

  render(container, data) {
    this.container = container;
    this.data = data;
    this.resetSearchState();
    container.innerHTML = '';
    container.className = 'json-viewer';
    container.appendChild(this.renderValue(data, 0, true));
  },

  getText() {
    if (this.data == null) {
      return '';
    }
    return JSON.stringify(this.data, null, 2);
  },

  resetSearchState() {
    this.searchHits = [];
    this.currentSearchIndex = -1;
    this.hasSearched = false;
    this.lastSearchKeyword = '';
    const statusEl = document.getElementById('json-search-status');
    if (statusEl) {
      statusEl.textContent = '';
    }
  },

  isPrimitive(value) {
    return value === null
      || typeof value === 'boolean'
      || typeof value === 'number'
      || typeof value === 'string';
  },

  createText(text, className) {
    const span = document.createElement('span');
    if (className) {
      span.className = className;
    }
    span.textContent = text;
    return span;
  },

  createPlaceholder() {
    const span = document.createElement('span');
    span.className = 'json-placeholder';
    return span;
  },

  createToggle(expanded, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'json-toggle' + (expanded ? ' is-expanded' : '');
    btn.textContent = expanded ? '−' : '+';
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      onClick();
    });
    return btn;
  },

  setExpanded(nodeEl, expanded) {
    nodeEl.classList.toggle('is-expanded', expanded);
    const toggle = nodeEl.querySelector(':scope > .json-line > .json-toggle');
    if (toggle) {
      toggle.classList.toggle('is-expanded', expanded);
      toggle.textContent = expanded ? '−' : '+';
    }
  },

  toggleNode(nodeEl) {
    this.setExpanded(nodeEl, !nodeEl.classList.contains('is-expanded'));
  },

  expandAll() {
    if (!this.container) {
      return;
    }
    this.container.querySelectorAll('.json-tree-node').forEach((node) => {
      this.setExpanded(node, true);
    });
  },

  collapseAll() {
    if (!this.container) {
      return;
    }
    this.container.querySelectorAll('.json-tree-node').forEach((node) => {
      const depth = Number(node.dataset.depth || '0');
      this.setExpanded(node, depth === 0);
    });
  },

  createLine(depth) {
    const line = document.createElement('div');
    line.className = 'json-line';
    line.style.paddingLeft = `${depth * this.INDENT}px`;
    return line;
  },

  appendComma(parent, isLast) {
    if (!isLast) {
      parent.appendChild(this.createText(',', 'json-comma'));
    }
  },

  renderPrimitive(value) {
    if (value === null) {
      return this.createText('null', 'json-null');
    }
    if (typeof value === 'boolean') {
      return this.createText(String(value), 'json-boolean');
    }
    if (typeof value === 'number') {
      return this.createText(String(value), 'json-number');
    }
    const text = String(value);
    if (text.length > 120 || /[\n\r\t]/.test(text)) {
      const wrap = document.createElement('span');
      wrap.className = 'json-string-wrap';
      wrap.appendChild(this.createText(JSON.stringify(text.substring(0, 120) + '…'), 'json-string'));
      wrap.title = text;
      return wrap;
    }
    return this.createText(JSON.stringify(text), 'json-string');
  },

  getPreview(value) {
    if (Array.isArray(value)) {
      return `Array[${value.length}]`;
    }
    if (value && typeof value === 'object') {
      return `{ ${Object.keys(value).length} keys }`;
    }
    return '';
  },

  wrapProperty(content) {
    const wrap = document.createElement('div');
    wrap.className = 'json-property';
    wrap.appendChild(content);
    return wrap;
  },

  renderCollapsibleNode(key, value, depth, isLast, kind) {
    const node = document.createElement('div');
    node.className = 'json-tree-node';
    node.dataset.depth = String(depth);

    const headLine = this.createLine(depth);
    headLine.appendChild(this.createToggle(false, () => this.toggleNode(node)));
    if (key != null) {
      headLine.appendChild(this.createText(`"${key}":`, 'json-key'));
      headLine.appendChild(document.createTextNode(' '));
    }
    headLine.appendChild(this.createText(this.getPreview(value), 'json-preview'));
    if (!isLast) {
      const comma = this.createText(',', 'json-comma json-inline-comma');
      headLine.appendChild(comma);
    }
    node.appendChild(headLine);

    const body = document.createElement('div');
    body.className = 'json-tree-body';

    const openToken = kind === 'array' ? '[' : '{';
    const closeToken = kind === 'array' ? ']' : '}';

    const openLine = this.createLine(depth + 1);
    openLine.appendChild(this.createPlaceholder());
    openLine.appendChild(this.createText(openToken, 'json-bracket'));
    body.appendChild(openLine);

    if (kind === 'array') {
      value.forEach((item, index) => {
        body.appendChild(this.renderArrayItem(item, depth + 1, index === value.length - 1));
      });
    } else {
      const keys = Object.keys(value);
      keys.forEach((childKey, index) => {
        body.appendChild(this.renderProperty(childKey, value[childKey], depth + 1, index === keys.length - 1));
      });
    }

    const closeLine = this.createLine(depth + 1);
    closeLine.appendChild(this.createPlaceholder());
    closeLine.appendChild(this.createText(closeToken, 'json-bracket'));
    this.appendComma(closeLine, isLast);
    body.appendChild(closeLine);

    node.appendChild(body);
    return this.wrapProperty(node);
  },

  renderProperty(key, value, depth, isLast) {
    if (this.isPrimitive(value)) {
      const line = this.createLine(depth);
      line.appendChild(this.createPlaceholder());
      line.appendChild(this.createText(`"${key}":`, 'json-key'));
      line.appendChild(document.createTextNode(' '));
      line.appendChild(this.renderPrimitive(value));
      this.appendComma(line, isLast);
      return this.wrapProperty(line);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createPlaceholder());
        line.appendChild(this.createText(`"${key}":`, 'json-key'));
        line.appendChild(document.createTextNode(' '));
        line.appendChild(this.createText('[]', 'json-bracket'));
        this.appendComma(line, isLast);
        return this.wrapProperty(line);
      }
      return this.renderCollapsibleNode(key, value, depth, isLast, 'array');
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createPlaceholder());
        line.appendChild(this.createText(`"${key}":`, 'json-key'));
        line.appendChild(document.createTextNode(' '));
        line.appendChild(this.createText('{}', 'json-bracket'));
        this.appendComma(line, isLast);
        return this.wrapProperty(line);
      }
      return this.renderCollapsibleNode(key, value, depth, isLast, 'object');
    }

    const line = this.createLine(depth);
    line.appendChild(this.createPlaceholder());
    line.appendChild(this.createText(`"${key}":`, 'json-key'));
    line.appendChild(document.createTextNode(' '));
    line.appendChild(this.createText(String(value), 'json-string'));
    this.appendComma(line, isLast);
    return this.wrapProperty(line);
  },

  renderArrayItem(value, depth, isLast) {
    if (this.isPrimitive(value)) {
      const line = this.createLine(depth);
      line.appendChild(this.createPlaceholder());
      line.appendChild(this.renderPrimitive(value));
      this.appendComma(line, isLast);
      return this.wrapProperty(line);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createPlaceholder());
        line.appendChild(this.createText('[]', 'json-bracket'));
        this.appendComma(line, isLast);
        return this.wrapProperty(line);
      }
      return this.renderCollapsibleNode(null, value, depth, isLast, 'array');
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createPlaceholder());
        line.appendChild(this.createText('{}', 'json-bracket'));
        this.appendComma(line, isLast);
        return this.wrapProperty(line);
      }
      return this.renderCollapsibleNode(null, value, depth, isLast, 'object');
    }

    const line = this.createLine(depth);
    line.appendChild(this.createPlaceholder());
    line.appendChild(this.createText(String(value), 'json-string'));
    this.appendComma(line, isLast);
    return this.wrapProperty(line);
  },

  renderRootObject(obj, depth, defaultExpanded) {
    const keys = Object.keys(obj);
    const node = document.createElement('div');
    node.className = 'json-tree-node' + (defaultExpanded ? ' is-expanded' : '');
    node.dataset.depth = String(depth);

    const headLine = this.createLine(depth);
    headLine.appendChild(this.createToggle(defaultExpanded, () => this.toggleNode(node)));
    headLine.appendChild(this.createText('{', 'json-bracket'));
    headLine.appendChild(this.createText(this.getPreview(obj), 'json-preview'));
    node.appendChild(headLine);

    const body = document.createElement('div');
    body.className = 'json-tree-body';
    keys.forEach((key, index) => {
      body.appendChild(this.renderProperty(key, obj[key], depth + 1, index === keys.length - 1));
    });

    const closeLine = this.createLine(depth);
    closeLine.appendChild(this.createPlaceholder());
    closeLine.appendChild(this.createText('}', 'json-bracket'));
    body.appendChild(closeLine);

    node.appendChild(body);
    return node;
  },

  renderRootArray(arr, depth, defaultExpanded) {
    const node = document.createElement('div');
    node.className = 'json-tree-node' + (defaultExpanded ? ' is-expanded' : '');
    node.dataset.depth = String(depth);

    const headLine = this.createLine(depth);
    headLine.appendChild(this.createToggle(defaultExpanded, () => this.toggleNode(node)));
    headLine.appendChild(this.createText('[', 'json-bracket'));
    headLine.appendChild(this.createText(this.getPreview(arr), 'json-preview'));
    node.appendChild(headLine);

    const body = document.createElement('div');
    body.className = 'json-tree-body';
    arr.forEach((item, index) => {
      body.appendChild(this.renderArrayItem(item, depth + 1, index === arr.length - 1));
    });

    const closeLine = this.createLine(depth);
    closeLine.appendChild(this.createPlaceholder());
    closeLine.appendChild(this.createText(']', 'json-bracket'));
    body.appendChild(closeLine);

    node.appendChild(body);
    return node;
  },

  renderValue(value, depth, defaultExpanded) {
    if (this.isPrimitive(value)) {
      const line = this.createLine(depth);
      line.appendChild(this.renderPrimitive(value));
      return line;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createText('[]', 'json-bracket'));
        return line;
      }
      return this.renderRootArray(value, depth, defaultExpanded);
    }
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        const line = this.createLine(depth);
        line.appendChild(this.createText('{}', 'json-bracket'));
        return line;
      }
      return this.renderRootObject(value, depth, defaultExpanded);
    }
    const line = this.createLine(depth);
    line.appendChild(this.createText(String(value), 'json-string'));
    return line;
  },

  updateSearchStatus() {
    const statusEl = document.getElementById('json-search-status');
    if (!statusEl) {
      return;
    }
    if (!this.hasSearched || !this.lastSearchKeyword) {
      statusEl.textContent = '';
      return;
    }
    if (this.searchHits.length === 0) {
      statusEl.textContent = `JSON 中未匹配到「${this.lastSearchKeyword}」`;
      return;
    }
    statusEl.textContent = `JSON 中匹配到 ${this.searchHits.length} 处「${this.lastSearchKeyword}」 · 第 ${this.currentSearchIndex + 1}/${this.searchHits.length} 处`;
  },

  highlightSearchHits(keyword) {
    if (!keyword || !this.container) {
      return 0;
    }
    const lowerKeyword = keyword.toLowerCase();
    const targets = this.container.querySelectorAll('.json-key, .json-string, .json-number, .json-boolean, .json-null, .json-preview');
    let matchCount = 0;

    targets.forEach((target) => {
      const textNodes = [];
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const parent = walker.currentNode.parentElement;
        if (parent && parent.classList.contains('json-search-hit')) {
          continue;
        }
        textNodes.push(walker.currentNode);
      }

      textNodes.forEach((node) => {
        const text = node.textContent;
        const lowerText = text.toLowerCase();
        let idx = 0;
        let start = lowerText.indexOf(lowerKeyword, idx);
        if (start === -1) {
          return;
        }

        const fragments = [];
        while (start !== -1) {
          matchCount += 1;
          if (start > idx) {
            fragments.push(document.createTextNode(text.substring(idx, start)));
          }
          const mark = document.createElement('mark');
          mark.className = 'json-search-hit';
          mark.textContent = text.substring(start, start + keyword.length);
          fragments.push(mark);
          idx = start + keyword.length;
          start = lowerText.indexOf(lowerKeyword, idx);
        }
        if (idx < text.length) {
          fragments.push(document.createTextNode(text.substring(idx)));
        }

        const parent = node.parentNode;
        fragments.forEach((fragment) => parent.insertBefore(fragment, node));
        parent.removeChild(node);
      });
    });
    return matchCount;
  },

  collectSearchHits() {
    if (!this.container) {
      this.searchHits = [];
      this.currentSearchIndex = -1;
      return;
    }
    this.searchHits = Array.from(this.container.querySelectorAll('.json-search-hit'));
    this.currentSearchIndex = this.searchHits.length > 0 ? 0 : -1;
  },

  focusSearchHit(index) {
    this.searchHits.forEach((hit) => hit.classList.remove('json-search-current'));
    if (index < 0 || index >= this.searchHits.length) {
      return false;
    }
    this.currentSearchIndex = index;
    const currentHit = this.searchHits[index];
    currentHit.classList.add('json-search-current');
    currentHit.scrollIntoView({ block: 'center', behavior: 'smooth' });
    this.updateSearchStatus();
    return true;
  },

  search(keyword) {
    keyword = (keyword || '').trim();
    if (this.data == null) {
      return false;
    }
    if (!keyword) {
      Util.showToast('请输入搜索关键字', 'info');
      return false;
    }

    this.render(this.container, this.data);
    this.expandAll();
    this.hasSearched = true;
    this.lastSearchKeyword = keyword;

    const matchCount = this.highlightSearchHits(keyword);
    if (matchCount === 0) {
      Util.showToast(`未搜索到「${keyword}」`, 'info');
      this.searchHits = [];
      this.currentSearchIndex = -1;
      this.updateSearchStatus();
      return false;
    }

    this.collectSearchHits();
    this.focusSearchHit(0);
    return true;
  },

  moveSearchHit(step) {
    if (!this.hasSearched || this.searchHits.length === 0) {
      const input = document.getElementById('json-search-input');
      return this.search(input ? input.value : '');
    }

    const nextIndex = this.currentSearchIndex + step;
    if (step < 0 && this.currentSearchIndex <= 0) {
      Util.showToast('已经是第一处', 'info');
      return false;
    }
    if (step > 0 && this.currentSearchIndex >= this.searchHits.length - 1) {
      Util.showToast('已经是最后一处', 'info');
      return false;
    }
    return this.focusSearchHit(nextIndex);
  },

  handleSearchEnter() {
    const input = document.getElementById('json-search-input');
    const keyword = input ? input.value.trim() : '';
    if (!keyword) {
      Util.showToast('请输入搜索关键字', 'info');
      return;
    }
    if (!this.hasSearched || keyword !== this.lastSearchKeyword) {
      this.search(keyword);
      return;
    }
    this.moveSearchHit(1);
  },

  clearSearch() {
    const input = document.getElementById('json-search-input');
    if (input) {
      input.value = '';
    }
    this.resetSearchState();
    if (this.data != null && this.container) {
      this.render(this.container, this.data);
    }
  },
};
