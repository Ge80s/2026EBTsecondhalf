// ========================
// 导航栏宽度拖拽调整（EFB 纯内存版）
// ========================
(function() {
    const resizer = document.getElementById('nav-resizer');
    const sidebar = document.getElementById('nav-sidebar');
    const toggle = document.getElementById('nav-toggle');
    if (!sidebar || !toggle) return;

    toggle.addEventListener('click', function() {
        const hidden = !sidebar.hidden;
        sidebar.hidden = hidden;
        if (resizer) resizer.hidden = hidden;
        toggle.textContent = hidden ? '📑 显示目录' : '📑 隐藏目录';
        toggle.setAttribute('aria-expanded', String(!hidden));
        document.dispatchEvent(new Event('manual-layout-change'));
    });

    if (!resizer) return;

    let isDragging = false;
    let startX = 0;
    let startWidth = 0;

    resizer.addEventListener('pointerdown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startWidth = sidebar.offsetWidth;
        resizer.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        resizer.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    document.addEventListener('pointermove', function(e) {
        if (!isDragging) return;
        const delta = e.clientX - startX;
        const MIN_W = 120;
        const MAX_W = 500;
        const newWidth = Math.min(MAX_W, Math.max(MIN_W, startWidth + delta));
        sidebar.style.width = newWidth + 'px';
    });

    const handlePointerUp = function(e) {
        if (!isDragging) return;
        isDragging = false;
        resizer.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        if (e.pointerId !== undefined) {
            try { resizer.releasePointerCapture(e.pointerId); } catch (err) {}
        }
    };

    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
})();

function setManualFontScale(value) {
    const scale = Number(value);
    if (![1, 1.15, 1.3, 1.45].includes(scale)) return;
    const inner = document.querySelector('.content-inner');
    if (inner) inner.style.zoom = String(scale);
    document.dispatchEvent(new Event('manual-layout-change'));
}