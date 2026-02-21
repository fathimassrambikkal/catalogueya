import React, { useState, useEffect } from "react";
import {
    BackIcon,
    IconView,
    IconSend,
    IconDownload,
    IconCalendar,
    IconInvoice,
    IconSuccess,
    IconError,
    IconNotifications,
    IconClose
} from "./CompanySvg";
import {
    getInvoiceHistory,
    sendInvoice,
    viewInvoice,
    downloadInvoice
} from "../companyDashboardApi";
import { toast } from "react-hot-toast";

function InvoiceHistory({ onBack }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingStates, setLoadingStates] = useState({}); // { [id]: 'view' | 'send' | 'download' | null }

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getInvoiceHistory(page);
            if (res.data?.status) {
                setInvoices(res.data.data.data);
                setPagination({
                    current_page: res.data.data.current_page,
                    last_page: res.data.data.last_page,
                    total: res.data.data.total
                });
            }
        } catch (error) {
            console.error("Error fetching invoice history:", error);
            toast.error("Failed to fetch invoice history");
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvoice = async (id) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'send' }));
        try {
            const res = await sendInvoice(id);
            toast.success(res.data?.message || "Invoice sent successfully");
        } catch (error) {
            console.error("Error sending invoice:", error);
            toast.error("Failed to send invoice");
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleDownloadInvoice = async (id, number) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'download' }));
        try {
            const res = await downloadInvoice(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${number || id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading invoice:", error);
            toast.error("Failed to download invoice");
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleViewInvoice = async (id) => {
        setLoadingStates(prev => ({ ...prev, [id]: 'view' }));
        try {
            const res = await viewInvoice(id);
            if (res.data?.status) {
                setSelectedInvoice(res.data.data);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Error viewing invoice:", error);
            toast.error("Failed to view invoice details");
        } finally {
            setLoadingStates(prev => ({ ...prev, [id]: null }));
        }
    };

    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        if (s === 'paid') return "bg-green-100 text-green-700 border-green-200";
        if (s === 'failed') return "bg-red-100 text-red-700 border-red-200";
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    };

    const getStatusIcon = (status) => {
        const s = status?.toLowerCase();
        if (s === 'paid') return <IconSuccess className="w-3 h-3" />;
        if (s === 'failed') return <IconError className="w-3 h-3" />;
        return <IconNotifications className="w-3 h-3" />;
    };

    if (loading && invoices.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <BackIcon className="w-5 h-5 text-slate-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Invoice History</h1>
                            <p className="text-slate-500 text-sm">View and manage all your subscription invoices</p>
                        </div>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-500 text-sm font-medium">Total Invoices: </span>
                        <span className="text-blue-600 font-bold">{pagination.total || 0}</span>
                    </div>
                </div>

                {/* LIST */}
                {invoices.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <IconInvoice className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No invoices found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">You don't have any subscription invoice history yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col relative overflow-hidden"
                            >
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyles(invoice.status)}`}>
                                        {getStatusIcon(invoice.status)}
                                        {invoice.status}
                                    </div>
                                    <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                                        <IconInvoice className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mb-6">
                                    <div className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">Invoice Number</div>
                                    <div className="text-lg font-bold text-slate-900 font-mono">{invoice.number}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-slate-400 text-xs font-medium mb-1">Plan</div>
                                        <div className="text-sm font-semibold text-slate-700">{invoice.subscription?.plan?.name || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-xs font-medium mb-1">Date</div>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                            <IconCalendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(invoice.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 text-xs font-medium">Amount</span>
                                        <span className="text-xl font-black text-slate-900">
                                            {parseFloat(invoice.amount).toFixed(2)} <span className="text-sm font-bold text-blue-600">{invoice.currency}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <IconButton
                                            icon={loadingStates[invoice.id] === 'view' ? <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /> : <IconView className="w-4 h-4" />}
                                            tooltip="View Details"
                                            onClick={() => handleViewInvoice(invoice.id)}
                                            disabled={!!loadingStates[invoice.id]}
                                        />
                                        <IconButton
                                            icon={loadingStates[invoice.id] === 'send' ? <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /> : <IconSend className="w-4 h-4" />}
                                            tooltip="Send to Email"
                                            onClick={() => handleSendInvoice(invoice.id)}
                                            disabled={!!loadingStates[invoice.id]}
                                        />
                                        <IconButton
                                            icon={loadingStates[invoice.id] === 'download' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IconDownload className="w-4 h-4" />}
                                            tooltip="Download PDF"
                                            onClick={() => handleDownloadInvoice(invoice.id, invoice.number)}
                                            variant="primary"
                                            disabled={!!loadingStates[invoice.id]}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => fetchInvoices(page)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${pagination.current_page === page
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-500"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Invoice Modal */}
            {isModalOpen && selectedInvoice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-5 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                            >
                                <IconClose className="w-5 h-5 text-white" />
                            </button>
                            <div className="flex items-center gap-4 mb-2">
                                <div>
                                    <h2 className="text-2xl font-black">Invoice Details</h2>
                                    <p className="text-blue-100 font-medium">#{selectedInvoice.number}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Status</label>
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusStyles(selectedInvoice.status)}`}>
                                            {getStatusIcon(selectedInvoice.status)}
                                            {selectedInvoice.status}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Plan Name</label>
                                        <p className="text-lg font-bold text-slate-800">{selectedInvoice.subscription?.plan?.name || 'N/A'}</p>
                                        <p className="text-slate-500 text-sm font-medium">Billed {selectedInvoice.subscription?.plan?.interval || 'periodically'}</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Date Created</label>
                                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                                            <IconCalendar className="w-4 h-4 text-blue-500" />
                                            {new Date(selectedInvoice.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-1">Payment Method</label>
                                        <p className="text-lg font-bold text-slate-800">Online Payment</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-500 font-medium">Subtotal</span>
                                    <span className="text-slate-700 font-bold">{parseFloat(selectedInvoice.amount).toFixed(2)} {selectedInvoice.currency}</span>
                                </div>
                                <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-4">
                                    <span className="text-slate-500 font-medium">Tax</span>
                                    <span className="text-slate-700 font-bold">0.00 {selectedInvoice.currency}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-900 text-xl font-black">Total Amount</span>
                                    <span className="text-3xl font-black text-blue-600">
                                        {parseFloat(selectedInvoice.amount).toFixed(2)} <span className="text-sm">{selectedInvoice.currency}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                            <button
                                onClick={() => handleDownloadInvoice(selectedInvoice.id, selectedInvoice.number)}
                                disabled={loadingStates[selectedInvoice.id] === 'download'}
                                className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                            >
                                {loadingStates[selectedInvoice.id] === 'download' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <IconDownload className="w-5 h-5" />
                                )}
                                {loadingStates[selectedInvoice.id] === 'download' ? 'Downloading...' : 'Download PDF'}
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 py-4 rounded-2xl font-bold transition-all shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function IconButton({ icon, tooltip, onClick, variant = "secondary", disabled = false }) {
    const styles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100",
        secondary: "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 hover:border-blue-100"
    };

    return (
        <div className="relative group/btn">
            <button
                onClick={onClick}
                disabled={disabled}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95 shadow-md active:shadow-sm'}`}
            >
                {icon}
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {tooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    );
}

export default React.memo(InvoiceHistory);
