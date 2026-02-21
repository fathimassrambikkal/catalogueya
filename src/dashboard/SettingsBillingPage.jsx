import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  getSubscription,
  getPlans,
  requestPlanChange,
  getInvoiceHistory,
  sendInvoice,
  viewInvoice,
  downloadInvoice
} from "../companyDashboardApi";
import { toast } from "react-hot-toast";
import {
  BackIcon,
  IconView,
  IconSend,
  IconDownload,
  IconInvoice,
  IconCalendar,
  IconSuccess,
  IconError,
  IconNotifications,
  IconClose,
  IconPast
} from "./CompanySvg";
import { FaRocket, FaCrown, FaGem,  FaThLarge, FaList } from "react-icons/fa";


export default function SettingsBillingPage({ onBack }) {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [requestingChange, setRequestingChange] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState({}); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, invRes] = await Promise.all([
        getSubscription(),
        getInvoiceHistory(1)
      ]);

      if (subRes.data?.status) setSubscription(subRes.data.data);
      if (invRes.data?.status) setInvoices(invRes.data.data?.data || []);
    } catch (error) {
      console.error("Error fetching billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPlans = async () => {
    setIsChangingPlan(true);
    try {
      const res = await getPlans();
      if (res.data?.status) {
        setPlans(res.data.data || []);
        setShowPlansModal(true);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setIsChangingPlan(false);
    }
  };

  const handleRequestChange = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan first");
      return;
    }
    setRequestingChange(true);
    try {
      const res = await requestPlanChange(selectedPlanId);
      if (res.data?.status) {
        toast.success(res.data.message || "Plan will change after current subscription ends");
        setShowPlansModal(false);
        fetchData();
      } else {
        toast.error(res.data?.message || "Failed to request plan change");
      }
    } catch (error) {
      toast.error("Failed to request plan change");
    } finally {
      setRequestingChange(false);
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
      toast.error("Failed to download invoice");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleSendInvoice = async (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: 'send' }));
    try {
      const res = await sendInvoice(id);
      toast.success(res.data?.message || "Invoice sent successfully");
    } catch (error) {
      toast.error("Failed to send invoice");
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
        setIsInvoiceModalOpen(true);
      }
    } catch (error) {
      toast.error("Failed to view invoice details");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleExportAllZip = async () => {
    if (invoices.length === 0) {
      toast.error("No invoices to export");
      return;
    }
    setLoadingStates(prev => ({ ...prev, global: 'export' }));
    const zip = new JSZip();
    const folder = zip.folder("Invoices");

    try {
      toast.loading("Preparing ZIP archive...", { id: 'zip-toast' });
      const downloads = invoices.map(async (inv) => {
        try {
          const res = await downloadInvoice(inv.id);
          folder.file(`Invoice-${inv.number}.pdf`, res.data);
        } catch (e) {
          console.error(`Failed to fetch invoice ${inv.number}`, e);
        }
      });

      await Promise.all(downloads);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Invoices_${new Date().toISOString().split('T')[0]}.zip`);
      toast.success("ZIP archive downloaded", { id: 'zip-toast' });
    } catch (error) {
      toast.error("Failed to create ZIP archive", { id: 'zip-toast' });
    } finally {
      setLoadingStates(prev => ({ ...prev, global: null }));
    }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === 'failed') return "bg-red-50 text-red-600 border-red-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid') return <IconSuccess className="w-3 h-3" />;
    if (s === 'failed') return <IconError className="w-3 h-3" />;
    return <IconNotifications className="w-3 h-3" />;
  };

  const getPlanIcon = (name) => {
    const n = name?.toLowerCase() || "";
    if (n.includes("monthly")) return <FaRocket className="text-blue-500" />;
    if (n.includes("yearly")) return <FaCrown className="text-amber-500" />;
    return <FaGem className="text-purple-500" />;
  };

  const displayedInvoices = showAllInvoices ? invoices : invoices.slice(0, 5);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-[clamp(0.75rem,4vw,2rem)] sm:px-[clamp(1rem,5vw,2.5rem)] lg:px-[clamp(1.5rem,6vw,3rem)] pt-[clamp(3rem,8vw,4rem)] md:pt-0">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="py-[clamp(1.5rem,4vw,2rem)]">
          <div className="flex items-center gap-2 mb-[clamp(0.75rem,2vw,1rem)] mt-[clamp(3rem,8vw,4rem)] md:mt-0">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-[clamp(0.75rem,1vw,0.875rem)] text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <BackIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>
            )}
          </div>
          <h1 className="text-[clamp(1.5rem,5vw,2.5rem)] sm:text-[clamp(2rem,5vw,2.5rem)] font-semibold text-gray-900 tracking-tight">
            Billing
          </h1>
          <p className="text-[clamp(0.875rem,2vw,1.125rem)] text-gray-600 mt-[clamp(0.25rem,1vw,0.5rem)]">
            Manage your subscription and view your payment history.
          </p>
        </div>

        {/* Content Grid */}
        <div className="space-y-[clamp(1.5rem,4vw,2rem)] pb-[clamp(2rem,8vw,4rem)]">
          {/* Current Plan Card */}
          <div className="bg-white rounded-[clamp(1.25rem,3vw,2rem)] shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-[clamp(1.5rem,4vw,2rem)] py-[clamp(1rem,3vw,1.5rem)] border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[clamp(0.75rem,2vw,1rem)]">
              <div>
                <h2 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold text-gray-900">Current Plan</h2>
                <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500 mt-[clamp(0.15rem,0.5vw,0.25rem)]">Operational Tier Allocation</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.15rem,0.5vw,0.25rem)] rounded-full text-[clamp(0.5rem,0.8vw,0.625rem)] font-black uppercase tracking-widest ring-1 ${subscription?.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-red-50 text-red-600 ring-red-100'
                  }`}>
                  {subscription?.subscription_status === 'active' ? 'Operational' : (subscription?.subscription_status || 'Offline')}
                </span>
              </div>
            </div>

            <div className="p-[clamp(1.5rem,4vw,2rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(2rem,5vw,3rem)]">
                <div>
                  <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(0.75rem,2vw,1rem)]">
                    <div className="w-[clamp(2.5rem,5vw,3rem)] h-[clamp(2.5rem,5vw,3rem)] rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm text-[clamp(1rem,2vw,1.25rem)]">
                      {getPlanIcon(subscription?.plan_name)}
                    </div>
                    <div>
                      <p className="text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Active Plan</p>
                      <p className="text-[clamp(1.25rem,3vw,2rem)] font-black text-gray-900">{subscription?.plan_name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-[clamp(0.5rem,1.5vw,0.75rem)]">
                    <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500 font-medium">Billed {subscription?.plan_interval}ly at QR {parseFloat(subscription?.plan_price || 0).toLocaleString()}</p>
                    <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500 font-medium">Unlimited Storage & Advanced Analytics</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="text-left md:text-right">
                    <p className="text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Next Billing Cycle</p>
                    <p className="text-[clamp(1rem,2.5vw,1.5rem)] font-bold text-gray-900 mt-[clamp(0.15rem,0.5vw,0.25rem)]">
                      {subscription?.subscription_ends_at ? new Date(subscription.subscription_ends_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-[clamp(0.75rem,2vw,1rem)] mt-[clamp(1rem,3vw,1.5rem)] justify-start md:justify-end">
                    <button
                      onClick={handleOpenPlans}
                      disabled={isChangingPlan}
                      className="px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 text-[clamp(0.75rem,1.5vw,1rem)]"
                    >
                      {isChangingPlan ? "Loading..." : "Upgrade Plan"}
                    </button>
                    <button className="px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95 text-[clamp(0.75rem,1.5vw,1rem)]">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History Card */}
          <div className="bg-white rounded-[clamp(1.25rem,3vw,2rem)] shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-[clamp(1.5rem,4vw,2rem)] py-[clamp(1rem,3vw,1.5rem)] border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-[clamp(1rem,3vw,1.5rem)]">
              <div>
                <h2 className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold text-gray-900">Billing History</h2>
                <p className="text-[clamp(0.7rem,1.2vw,0.875rem)] text-gray-500 mt-[clamp(0.15rem,0.5vw,0.25rem)]">Transaction records</p>
              </div>

              <div className="flex items-center gap-[clamp(0.75rem,2vw,1rem)] w-full md:w-auto">
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    aria-label="Table View"
                  >
                    <FaList size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                    aria-label="Grid View"
                  >
                    <FaThLarge size={14} />
                  </button>
                </div>

                <button
                  onClick={handleExportAllZip}
                  disabled={loadingStates.global === 'export'}
                  className="px-[clamp(0.75rem,2vw,1.25rem)] py-[clamp(0.4rem,1.2vw,0.625rem)] bg-gray-900 hover:bg-black text-white text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingStates.global === 'export' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <IconDownload className="w-4 h-4" />
                  )}
                  Export All (.ZIP)
                </button>
              </div>
            </div>

            <div className="p-[clamp(1.5rem,4vw,2rem)]">
              {invoices.length === 0 ? (
                <div className="py-[clamp(3rem,10vw,5rem)] text-center">
                  <div className="w-[clamp(4rem,10vw,5rem)] h-[clamp(4rem,10vw,5rem)] bg-gray-50 rounded-[clamp(1.5rem,4vw,2.5rem)] flex items-center justify-center mx-auto mb-[clamp(1rem,3vw,1.5rem)]">
                    <IconInvoice className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[clamp(0.7rem,1.5vw,0.875rem)]">No transaction records detected</p>
                </div>
              ) : viewMode === "table" ? (
                <div className="overflow-x-auto overflow-y-hidden">
                  <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="text-left py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Invoice</th>
                          <th className="text-left py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Plan</th>
                          <th className="text-left py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                          <th className="text-left py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="text-right py-[clamp(0.75rem,2vw,1rem)] px-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.6rem,1vw,0.75rem)] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {displayedInvoices.map((inv) => (
                          <tr key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)]">
                              <p className="text-[clamp(0.7rem,1.5vw,0.875rem)] font-bold text-gray-900">{new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] font-medium text-gray-400 mt-0.5">{new Date(inv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </td>
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)]">
                              <span className="text-[clamp(0.7rem,1.5vw,0.875rem)] font-mono font-bold text-gray-600">{inv.number}</span>
                            </td>
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)]">
                              <span className="text-[clamp(0.7rem,1.5vw,0.875rem)] font-medium text-gray-600">{inv.subscription?.plan?.name || "Tier Usage"}</span>
                            </td>
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)] font-black text-gray-900 text-[clamp(0.7rem,1.5vw,0.875rem)]">
                              QR {parseFloat(inv.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)]">
                              <span className={`inline-flex items-center gap-1.5 px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.15rem,0.5vw,0.25rem)] rounded-full text-[clamp(0.5rem,0.8vw,0.625rem)] font-black uppercase tracking-wider border ${getStatusStyles(inv.status)}`}>
                                {getStatusIcon(inv.status)}
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(0.75rem,2vw,1rem)]">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleViewInvoice(inv.id)}
                                  disabled={!!loadingStates[inv.id]}
                                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90"
                                >
                                  {loadingStates[inv.id] === 'view' ? <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" /> : <IconView className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleSendInvoice(inv.id)}
                                  disabled={!!loadingStates[inv.id]}
                                  className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90"
                                >
                                  {loadingStates[inv.id] === 'send' ? <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /> : <IconSend className="w-4 h-4" />}
                                </button>
                                <button 
                                  onClick={() => handleDownloadInvoice(inv.id, inv.number)}
                                  disabled={!!loadingStates[inv.id]}
                                  className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-white hover:shadow-md rounded-xl transition-all active:scale-90"
                                >
                                  {loadingStates[inv.id] === 'download' ? <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" /> : <IconDownload className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[clamp(1rem,3vw,1.5rem)]">
                  {displayedInvoices.map((inv) => (
                    <div key={inv.id} className="bg-white rounded-[clamp(1.5rem,4vw,2rem)] p-[clamp(1rem,3vw,1.5rem)] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[clamp(4rem,10vw,6rem)] h-[clamp(4rem,10vw,6rem)] bg-blue-50/30 rounded-full blur-2xl -mr-[clamp(2rem,5vw,3rem)] -mt-[clamp(2rem,5vw,3rem)] group-hover:bg-blue-100/40 transition-colors"></div>

                      <div className="flex justify-between items-start mb-[clamp(1rem,3vw,1.5rem)] relative">
                        <span className={`flex items-center gap-1.5 px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.15rem,0.5vw,0.25rem)] rounded-full text-[clamp(0.5rem,0.8vw,0.625rem)] font-black border uppercase tracking-widest ${getStatusStyles(inv.status)}`}>
                          {getStatusIcon(inv.status)}
                          {inv.status}
                        </span>
                        <IconInvoice className="w-6 h-6 text-gray-200 group-hover:text-blue-500 transition-colors" />
                      </div>

                      <div className="mb-[clamp(1rem,3vw,1.5rem)]">
                        <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Invoice ID</p>
                        <p className="text-[clamp(1rem,2.5vw,1.5rem)] font-black text-gray-900 font-mono tracking-tighter">{inv.number}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-[clamp(0.75rem,2vw,1rem)] mb-[clamp(1rem,3vw,1.5rem)]">
                        <div>
                          <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] font-black text-gray-300 uppercase mb-1">Timeline</p>
                          <p className="text-[clamp(0.6rem,1.2vw,0.75rem)] font-bold text-gray-600">{new Date(inv.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-[clamp(0.5rem,0.8vw,0.625rem)] font-black text-gray-300 uppercase mb-1">Billed Tier</p>
                          <p className="text-[clamp(0.6rem,1.2vw,0.75rem)] font-bold text-gray-600 line-clamp-1">{inv.subscription?.plan?.name || "Usage"}</p>
                        </div>
                      </div>

                      <div className="mt-auto pt-[clamp(1rem,3vw,1.5rem)] border-t border-gray-50 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[clamp(0.5rem,0.8vw,0.625rem)] font-black text-gray-300 uppercase">Amount Billed</span>
                          <span className="text-[clamp(1.25rem,3vw,1.5rem)] font-black text-gray-900">QR {parseFloat(inv.amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleViewInvoice(inv.id)} className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-white hover:shadow-md text-gray-400 hover:text-blue-600 rounded-xl transition-all">
                            <IconView className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDownloadInvoice(inv.id, inv.number)} className="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                            <IconDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View More Button */}
              {invoices.length > 5 && !showAllInvoices && (
                <div className="mt-[clamp(1.5rem,4vw,2rem)] text-center">
                  <button
                    onClick={() => setShowAllInvoices(true)}
                    className="px-[clamp(1.5rem,4vw,2rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 font-black uppercase tracking-widest text-[clamp(0.6rem,1vw,0.75rem)] rounded-2xl transition-all border border-transparent hover:border-blue-100 active:scale-95"
                  >
                    Load Full History Records ({invoices.length - 5} More)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     {/* PLANS MODAL - Frosted Glass Minimalist (Apple-inspired) */}
{showPlansModal && (
  <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
    {/* Backdrop with ultra-thin blur */}
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
      onClick={() => setShowPlansModal(false)}
    />

    {/* Modal - frosted glass */}
    <div className="relative w-full max-w-[900px] max-h-[85vh] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/30 animate-scaleFade">
      <style>{`
        @keyframes scaleFade {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleFade {
          animation: scaleFade 0.25s ease-out;
        }
      `}</style>

      {/* Header - clean minimal */}
      <div className="px-8 py-6 border-b border-gray-100/50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">Ecosystem Plans</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Precision engineered for business growth</p>
        </div>
        <button
          onClick={() => setShowPlansModal(false)}
          className="w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable plan list - compact */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-200 ${
                selectedPlanId === plan.id
                  ? 'bg-blue-50 border-2 border-blue-400 shadow-sm'
                  : 'bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-gray-50'
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Selected checkmark */}
              {selectedPlanId === plan.id && (
                <div className="absolute top-4 right-4">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-4 mb-4">
  <div
    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base transition-all duration-300 ${
      selectedPlanId === plan.id
        ? "bg-white text-gray-900 ring-1 ring-gray-200 shadow-sm"
        : "bg-gray-50 text-gray-400"
    }`}
  >
    {getPlanIcon(plan.name)}
  </div>

  <div>
                  <h3 className={`font-semibold ${
                    selectedPlanId === plan.id ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{plan.interval}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-gray-900">{plan.currency} {parseFloat(plan.price).toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-medium">/{plan.interval}</span>
              </div>

              {/* Feature list - minimal dots */}
              <div className="space-y-2 pt-3 border-t border-gray-100">
                {[
                  "Full Product Inventory Management",
                  "Real-time Commercial Analytics",
                  "Prioritized Technical Support",
                  "Multi-platform Synchronization"
                ].map((feature, fidx) => (
                  <div key={fidx} className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - minimal action */}
      <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100/50">
        <button
          onClick={handleRequestChange}
          disabled={!selectedPlanId || requestingChange}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-sm"
        >
          {requestingChange ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            'Execute Transition'
          )}
        </button>
        <div className="mt-3 flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-400 font-medium">
            Synchronous change activation upon billing reset
          </p>
        </div>
      </div>
    </div>
  </div>
)}

{/* INVOICE DETAILS MODAL - Frosted Glass Minimalist */}
{isInvoiceModalOpen && selectedInvoice && (
  <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 overflow-hidden">
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
      onClick={() => setIsInvoiceModalOpen(false)}
    />
    
    <div className="relative w-full max-w-[500px] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 animate-scaleFade">
      <style>{`
        @keyframes scaleFade {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scaleFade {
          animation: scaleFade 0.2s ease-out;
        }
      `}</style>

      <div className="px-6 py-5 border-b border-gray-100/50 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Transaction Receipt</h2>
        <button
          onClick={() => setIsInvoiceModalOpen(false)}
          className="w-8 h-8 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Record Index */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Record Index</span>
          <span className="text-sm font-medium text-gray-900">#{selectedInvoice.number}</span>
        </div>

        {/* Status Report */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status Report</span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            selectedInvoice.status === 'paid' 
              ? 'bg-green-50 text-green-600 border-green-100' 
              : 'bg-yellow-50 text-yellow-600 border-yellow-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${selectedInvoice.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            {selectedInvoice.status}
          </div>
        </div>

        {/* Provisioned Tier */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Provisioned Tier</span>
          <span className="text-sm font-medium text-gray-900">
            {selectedInvoice.subscription?.plan?.name || 'Standard Distribution'}
          </span>
        </div>

        {/* Operational Cycle Reset */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Operational Cycle</span>
          <span className="text-xs text-gray-400">Reset</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Timestamp</span>
          <span className="text-sm text-gray-900">
            {new Date(selectedInvoice.created_at).toLocaleString([], { 
              dateStyle: 'medium', 
              timeStyle: 'short' 
            })}
          </span>
        </div>

        {/* Financial breakdown */}
        <div className="bg-gray-50/80 rounded-xl p-4 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Net Settlement</span>
            <span className="text-sm font-medium text-gray-900">QR {parseFloat(selectedInvoice.amount).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Tax Allocation</span>
            <span className="text-sm font-medium text-gray-900">QR 0.00</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-gray-900">Grand Total</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold text-blue-600">{parseFloat(selectedInvoice.amount).toFixed(2)}</span>
              <span className="text-xs font-medium text-blue-400 uppercase">{selectedInvoice.currency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100/50 flex gap-2">
        <button
          onClick={() => handleDownloadInvoice(selectedInvoice.id, selectedInvoice.number)}
          disabled={loadingStates[selectedInvoice.id] === 'download'}
          className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
        >
          {loadingStates[selectedInvoice.id] === 'download' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
          ) : (
            'Request PDF Binary'
          )}
        </button>
        <button
          onClick={() => setIsInvoiceModalOpen(false)}
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}