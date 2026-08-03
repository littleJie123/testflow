const MdFileView = {
  modal: null,
  modalContent: null,
  closeBtn: null,
  currentMdFilePath: '',

  init() {
    if (this.modal != null) {
      return;
    }
    this.modal = document.getElementById('stepModal');
    if (this.modal == null) {
      return;
    }
    this.modalContent = this.modal.querySelector('.modal-content-body');
    this.closeBtn = this.modal.querySelector('.close');
    if (this.closeBtn) {
      this.closeBtn.onclick = () => {
        this.setLogsPanelVisible(true);
        this.modal.style.display = 'none';
      };
    }
    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.setLogsPanelVisible(true);
        this.modal.style.display = 'none';
      }
    });
  },

  setLogsPanelVisible(visible) {
    const logsPanel = this.modal?.querySelector('.modal-logs-panel');
    if (logsPanel) {
      logsPanel.style.display = visible ? '' : 'none';
    }
    this.modal?.classList.toggle('md-file-view', !visible);
  },

  async open(meta) {
    this.init();
    if (this.modal == null || this.modalContent == null) {
      return;
    }
    this.currentMdFilePath = meta.filePath;
    // md 弹窗不展示运行日志
    this.setLogsPanelVisible(false);
    const titleEl = document.getElementById('modalStepTitle');
    if (titleEl) {
      titleEl.textContent = meta.name || meta.srcPath || meta.filePath || '';
      titleEl.style.display = titleEl.textContent ? 'block' : 'none';
    }
    const remarkEl = document.getElementById('modalStepRemark');
    if (remarkEl) {
      if (meta.remark) {
        remarkEl.textContent = meta.remark;
        remarkEl.style.display = 'block';
      } else {
        remarkEl.textContent = '';
        remarkEl.style.display = 'none';
      }
    }
    this.modalContent.innerHTML = `
      <div class="modal-header">
        <button class="btn" id="md-edit-btn" onclick="MdFileView.edit()">修改</button>
        <button class="btn" id="md-save-btn" style="display:none" onclick="MdFileView.save()">保存</button>
        <button class="btn" id="md-cancel-btn" style="display:none" onclick="MdFileView.cancelEdit()">取消</button>
      </div>
      <p><strong>文件:</strong> ${meta.srcPath || meta.filePath}</p>
      <div id="modal-md-preview" class="md-preview">加载中...</div>
      <textarea id="modal-md-source" class="md-source" style="display:none"></textarea>
    `;
    this.modal.style.display = 'block';
    await this.loadPreview();
  },

  async loadPreview() {
    try {
      const data = await Http.get().post('/getMdFile', { filePath: this.currentMdFilePath });
      const content = data.content ?? '';
      document.getElementById('modal-md-source').value = content;
      document.getElementById('modal-md-preview').innerHTML = marked.parse(content);
    } catch (error) {
      document.getElementById('modal-md-preview').innerHTML = '<p>加载失败</p>';
      Util.showToast('加载 md 文件失败', 'error');
    }
  },

  edit() {
    document.getElementById('modal-md-preview').style.display = 'none';
    document.getElementById('modal-md-source').style.display = 'block';
    document.getElementById('md-edit-btn').style.display = 'none';
    document.getElementById('md-save-btn').style.display = 'inline-block';
    document.getElementById('md-cancel-btn').style.display = 'inline-block';
  },

  cancelEdit() {
    document.getElementById('modal-md-preview').style.display = 'block';
    document.getElementById('modal-md-source').style.display = 'none';
    document.getElementById('md-edit-btn').style.display = 'inline-block';
    document.getElementById('md-save-btn').style.display = 'none';
    document.getElementById('md-cancel-btn').style.display = 'none';
  },

  async save() {
    const content = document.getElementById('modal-md-source').value;
    try {
      await Http.get().post('/saveMdFile', {
        filePath: this.currentMdFilePath,
        content: content,
      });
      Util.showToast('保存成功');
      this.cancelEdit();
      await this.loadPreview();
    } catch (error) {
      Util.showToast('保存失败', 'error');
    }
  },
};
