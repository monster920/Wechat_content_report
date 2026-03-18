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
    <div className="fixed bottom-0 left-0 right-0 glass-card border-t border-purple-500/30 rounded-none z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧功能区 */}
          <div className="flex items-center space-x-6">
            {/* 导出按钮 */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-[#64748b]">导出：</span>
              <div className="flex space-x-2">
                {exportFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => onExport(format.value)}
                    className="px-4 py-2 text-sm bg-black/30 text-[#a78bfa] border border-purple-500/30 rounded-lg hover:bg-purple-500/30 hover:text-white transition-all backdrop-blur-sm"
                  >
                    {format.icon} {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 分隔线 */}
            <div className="w-px h-6 bg-purple-500/30" />

            {/* 一键改稿 */}
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-black/30 text-[#a78bfa] border border-purple-500/30 rounded-lg hover:bg-purple-500/30 hover:text-white transition-all backdrop-blur-sm"
            >
              <span>✏️</span>
              <span>一键改稿</span>
            </button>

            {/* 分享报告 */}
            <button
              onClick={onShare}
              className="flex items-center space-x-2 px-4 py-2 text-sm bg-black/30 text-[#a78bfa] border border-purple-500/30 rounded-lg hover:bg-purple-500/30 hover:text-white transition-all backdrop-blur-sm"
            >
              <span>🔗</span>
              <span>分享报告</span>
            </button>
          </div>

          {/* 右侧：创建新诊断 */}
          <button
            onClick={onCreateNew}
            className="flex items-center space-x-2 px-6 py-3 text-sm bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
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