import React from 'react';

const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = 'danger' // 'danger' | 'success' | 'warning'
}) => {
  if (!show) return null;

  const styles = {
    danger: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      btnBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    },
    success: {
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      btnBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      iconPath: "M5 13l4 4L19 7"
    },
    warning: {
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      btnBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    }
  };

  const currentStyle = styles[type] || styles.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all w-full max-w-md overflow-hidden ring-1 ring-black/5">
        
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Dynamic Icon */}
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${currentStyle.iconBg} mb-5`}>
              <svg className={`h-8 w-8 ${currentStyle.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={currentStyle.iconPath} />
              </svg>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-[16rem] mx-auto sm:max-w-none">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center items-center px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`inline-flex w-full justify-center items-center px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentStyle.btnBg}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;