import React from 'react';

interface ExportToolbarProps {
  onExport: (format: string) => void;
  onEdit: () => void;
  onShare: () => void;
  onCreateNew: () => void;
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ onExport, onEdit, onShare, onCreateNew }) => {
  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'word', label: 'Word', icon: '📝' },
    { value: 'markdown', label: 'Markdown', icon: '📋' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary border-t border-light z-50">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧功能区 */}
          <div className="flex items-center space-x-4">
            {/* 导出按钮 */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted">导出：</span>
              <div className="flex space-x-1">
                {exportFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onExport(format.value)}
                    className="px-3 py-1.5 text-xs bg-tertiary text-primary border border-light rounded-md hover:bg-secondary transition-all"
                  >
                    {format.icon} {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-4 bg-light" />

            {/* 一键改稿 */}
            <button
              onClick={onEdit}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-tertiary text-primary border border-light rounded-md hover:bg-secondary transition-all"
            >
              <span>✏️</span>
              <span>改稿</span>
            </button>

            {/* 分享报告 */}
            <button
              onClick={onShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-tertiary text-primary border border-light rounded-md hover:bg-secondary transition-all"
            >
              <span>🔗</span>
              <span>分享</span>
            </button>
          </div>

          {/* 右侧：创建新诊断 */}
          <button
            onClick={onCreateNew}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs bg-accent text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all"
          >
            <span>➕</span>
            <span>新建诊断</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportToolbar;