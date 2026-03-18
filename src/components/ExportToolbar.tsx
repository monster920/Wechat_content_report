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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧功能区 */}
          <div className="flex items-center space-x-4">
            {/* 导出按钮 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">导出：</span>
              <div className="flex space-x-1">
                {exportFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onExport(format.value)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {format.icon} {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-gray-300" />

            {/* 一键改稿 */}
            <button
              onClick={onEdit}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
            >
              <span>✏️</span>
              <span>一键改稿</span>
            </button>

            {/* 分享报告 */}
            <button
              onClick={onShare}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
            >
              <span>🔗</span>
              <span>分享报告</span>
            </button>
          </div>

          {/* 右侧：创建新诊断 */}
          <button
            onClick={onCreateNew}
            className="flex items-center space-x-1 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors"
          >
            <span>➕</span>
            <span>创建新诊断</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportToolbar;