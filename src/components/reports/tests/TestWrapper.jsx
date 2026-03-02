import { ArrowLeft, Save } from 'lucide-react';

export default function TestWrapper({
    title,
    subtitle,
    onCancel,
    onSubmit,
    isSubmitDisabled = false,
    submitText = "Save Data",
    headerActions,
    children
}) {
    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de que deseas salir? Los datos de esta prueba no se guardarán.')) {
            onCancel();
        }
    };

    return (
        <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        title="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                        <p className="text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                {headerActions && (
                    <div className="flex gap-2">
                        {headerActions}
                    </div>
                )}
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                
                {children}

                <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                        type="submit" 
                        disabled={isSubmitDisabled} 
                        className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        <span>{submitText}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}