"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Store, blankData, getSampleEnterpriseData } from "@/lib/store";
import { SITE, waLink } from "@/lib/config";

const ENQ_STATUS = ["New", "Contacted", "Inspection", "Quoted", "Won", "Lost"];
const QT_STATUS = ["Draft", "Sent", "Approved", "Rejected"];
const JOB_STATUS = ["Scheduled", "In progress", "On hold", "Completed"];

const PRESETS = [
  { desc: "Gas lift replacement (Class 4 heavy-duty)", rate: 750 },
  { desc: "Heavy-duty nylon wheel castor set (5 nos)", rate: 450 },
  { desc: "Reinforced star base replacement (Nylon)", rate: 850 },
  { desc: "Heavy cast-iron / steel star base", rate: 1200 },
  { desc: "Synchro tilt-lock mechanism replacement", rate: 950 },
  { desc: "3D adjustable armrest replacement (pair)", rate: 650 },
  { desc: "High-density molded seat foam + fabric re-upholstery", rate: 850 },
  { desc: "Breathable back mesh replacement & re-tensioning", rate: 700 },
  { desc: "On-site fabric chair deep extraction shampooing", rate: 350 },
  { desc: "Mesh chair deep cleaning & sanitization", rate: 250 },
  { desc: "Comprehensive on-site inspection, lubrication & tune-up", rate: 150 },
  { desc: "New Ergonomic High-Back Office Chair", rate: 6500 },
  { desc: "New Executive Leatherette Chair", rate: 7800 },
  { desc: "New Mesh Back Task Chair", rate: 4200 }
];

export default function AdminPage() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState(blankData());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");

  // Selected item modals / drawers
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // New Quotation Modal
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [newQuoteItems, setNewQuoteItems] = useState([
    { desc: "Gas lift replacement (Class 4 heavy-duty)", qty: 10, rate: 750 }
  ]);
  const [newQuoteCustomer, setNewQuoteCustomer] = useState({
    name: "",
    company: "",
    phone: "",
    discount: 0
  });

  // Manual Lead / Enquiry Modal
  const [showManualLeadModal, setShowManualLeadModal] = useState(false);
  const [manualLeadForm, setManualLeadForm] = useState({
    name: "",
    company: "",
    phone: "",
    city: "Chennai",
    service: "Chair Repair & Spares",
    quantity: 10,
    problem: "Sinking gas lift / hydraulic cylinder",
    notes: ""
  });

  // Schedule Job Modal
  const [showScheduleJobModal, setShowScheduleJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    customerName: "",
    phone: "",
    technician: "Imran",
    chairs: 20,
    scheduledDate: "",
    notes: ""
  });

  // Password Change State in Settings
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // Company Profile State in Settings
  const [companySettings, setCompanySettings] = useState({
    businessName: "",
    phone: "",
    address: "",
    gstin: "",
    bank: "",
    gstPct: 18,
    quoteTerms: ""
  });
  const [settingsFeedback, setSettingsFeedback] = useState(null);

  const [sqlConnected, setSqlConnected] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const d = Store.load();
    setData(d);
    setCompanySettings({
      businessName: d.settings?.businessName || SITE.name,
      phone: d.settings?.phone || SITE.phone,
      address: d.settings?.address || SITE.address,
      gstin: d.settings?.gstin || "33AABCA1234F1Z9",
      bank: d.settings?.bank || "Bank: HDFC Bank\nA/c: 50200081223388\nIFSC: HDFC0001234\nBranch: Guindy, Chennai",
      gstPct: d.settings?.gstPct || 18,
      quoteTerms: d.settings?.quoteTerms || ""
    });

    // Synchronize with backend SQL Database
    Store.syncWithSql().then((synced) => {
      if (synced) {
        setData(synced);
        setSqlConnected(true);
        if (synced.settings) {
          setCompanySettings((prev) => ({
            ...prev,
            ...synced.settings
          }));
        }
      }
    });

    sessionStorage.removeItem("cs_admin"); // legacy client-side flag, no longer trusted
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (s?.authenticated) setIsAuthenticated(true);
      })
      .catch(() => {});
  }, []);

  // The PIN is checked on the server (/api/admin/login), which sets an HttpOnly session cookie.
  const handleLogin = async (e) => {
    e.preventDefault();
    setPinError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput.trim() })
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPinError(out.error || "Incorrect staff password. Please try again.");
        return;
      }
      setPinInput("");
      setIsAuthenticated(true);
      const synced = await Store.syncWithSql();
      if (synced) {
        setData(synced);
        setSqlConnected(true);
        if (synced.settings) setCompanySettings((prev) => ({ ...prev, ...synced.settings }));
      }
    } catch {
      setPinError("Could not reach the server. Please try again.");
    }
  };

  const handleLogout = () => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setIsAuthenticated(false);
    setPinInput("");
  };

  const updateStore = (updater) => {
    const nextData = updater({ ...data });
    setData(nextData);
    Store.save(nextData);
  };

  const formatCurrency = (amount) => {
    return `${data.settings?.currency || "₹"}${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Handle Password Change in Settings
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback({
        type: "error",
        message: "New password must be at least 8 characters long."
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "New password and Confirm password do not match."
      });
      return;
    }

    let res;
    try {
      res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin: currPassword, newPin: newPassword })
      });
    } catch {
      setPasswordFeedback({ type: "error", message: "Could not reach the server. Please try again." });
      return;
    }
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      setPasswordFeedback({ type: "error", message: out.error || "Password could not be changed." });
      return;
    }

    setCurrPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFeedback({
      type: "success",
      message: "Password updated. Use the new password next time you log in."
    });
  };

  // Handle Company Profile Save in Settings
  const handleSaveCompanySettings = (e) => {
    e.preventDefault();
    updateStore((d) => {
      d.settings = {
        ...d.settings,
        ...companySettings
      };
      return d;
    });

    // Persist to SQL database
    fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companySettings)
    }).catch((err) => console.warn("SQL settings update error:", err));

    setSettingsFeedback({
      type: "success",
      message: "Business profile and quotation terms saved to SQL database!"
    });
    setTimeout(() => setSettingsFeedback(null), 4000);
  };

  // Load Enterprise Sample Data
  const handleLoadSampleData = () => {
    if (
      (data.enquiries?.length > 0 || data.quotes?.length > 0) &&
      !confirm("Load Chennai corporate sample leads and quotations into SQL database? This will add realistic active records.")
    ) {
      return;
    }

    Store.seedSql().then((synced) => {
      if (synced) setData(synced);
      alert("Loaded 5 Chennai enterprise leads, active quotations, and technician schedule into SQL Database!");
    });
  };

  // Clear All Data
  const handleClearAllData = () => {
    if (confirm("Are you sure you want to reset all enquiries, quotes, and jobs? Settings and password will be preserved.")) {
      updateStore((d) => {
        d.enquiries = [];
        d.quotes = [];
        d.jobs = [];
        d.invoices = [];
        return d;
      });
      alert("All records cleared successfully.");
    }
  };

  // Create Manual Lead Submit
  const handleCreateManualLead = (e) => {
    e.preventDefault();
    if (!manualLeadForm.name || !manualLeadForm.phone) {
      alert("Please provide at least a customer name and phone number.");
      return;
    }
    const enq = {
      source: "Manual Staff Entry",
      name: manualLeadForm.name,
      company: manualLeadForm.company,
      phone: manualLeadForm.phone,
      city: manualLeadForm.city || "Chennai",
      service: manualLeadForm.service,
      quantity: Number(manualLeadForm.quantity) || 1,
      problems: manualLeadForm.problem ? [manualLeadForm.problem] : [],
      status: "New",
      notes: manualLeadForm.notes ? [manualLeadForm.notes] : []
    };
    Store.addEnquiry(enq);
    setData(Store.load());
    setShowManualLeadModal(false);
    setManualLeadForm({
      name: "",
      company: "",
      phone: "",
      city: "Chennai",
      service: "Chair Repair & Spares",
      quantity: 10,
      problem: "Sinking gas lift / hydraulic cylinder",
      notes: ""
    });
  };

  // Schedule Job Submit
  const handleScheduleJob = (e) => {
    e.preventDefault();
    const jId = Store.nextId(data, "JOB");
    const newJob = {
      id: jId,
      customerName: jobForm.customerName || "Customer",
      phone: jobForm.phone,
      technician: jobForm.technician,
      chairs: Number(jobForm.chairs) || 1,
      progress: "0%",
      scheduledDate: jobForm.scheduledDate || "This Week",
      status: "Scheduled",
      notes: jobForm.notes
    };
    updateStore((d) => {
      d.jobs = d.jobs || [];
      d.jobs.unshift(newJob);
      return d;
    });
    setShowScheduleJobModal(false);
    setJobForm({
      customerName: "",
      phone: "",
      technician: "Imran",
      chairs: 20,
      scheduledDate: "",
      notes: ""
    });
  };

  // Convert Enquiry directly to Quote
  const handleConvertEnquiryToQuote = (enq) => {
    setNewQuoteCustomer({
      name: enq.name || "",
      company: enq.company || "",
      phone: enq.phone || "",
      discount: 0
    });
    setNewQuoteItems([
      {
        desc: `${enq.service} for ${enq.quantity || 10} chairs`,
        qty: Number(enq.quantity) || 10,
        rate: enq.service.includes("Cleaning") ? 350 : 750
      }
    ]);
    setShowNewQuoteModal(true);
  };

  // Calculations for dashboard
  const openEnquiries = useMemo(
    () => (data.enquiries || []).filter((e) => e.status !== "Won" && e.status !== "Lost"),
    [data.enquiries]
  );
  const activeJobs = useMemo(
    () => (data.jobs || []).filter((j) => j.status !== "Completed"),
    [data.jobs]
  );
  const quotesCount = data.quotes?.length || 0;
  const quotesPipelineValue = useMemo(() => {
    return (data.quotes || []).reduce((acc, q) => {
      const subtotal = (q.items || []).reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
      return acc + subtotal * (1 + (data.settings?.gstPct || 18) / 100);
    }, 0);
  }, [data.quotes, data.settings?.gstPct]);

  const wonEnquiriesCount = useMemo(
    () => (data.enquiries || []).filter((e) => e.status === "Won").length,
    [data.enquiries]
  );

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return (data.enquiries || []).filter((enq) => {
      const matchesSearch =
        !searchQuery ||
        (enq.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enq.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enq.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enq.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enq.id || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "All" || enq.status === statusFilter;
      const matchesService = serviceFilter === "All" || (enq.service || "").includes(serviceFilter);

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [data.enquiries, searchQuery, statusFilter, serviceFilter]);

  if (!isClient) return null;

  // -------------------------------------------------------------
  // VIEW 1: STAFF LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(800px 500px at 50% 20%, rgba(13, 148, 136, 0.18) 0%, transparent 60%), radial-gradient(600px 400px at 80% 80%, rgba(245, 165, 36, 0.12) 0%, transparent 50%)"
          }}
        />

        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SITE.logo} alt={SITE.name} className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Staff Service Desk &amp; ERP</h1>
            <p className="text-xs text-slate-500 mt-1">Chennai Operations &amp; Lead Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Staff Access Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPass ? "text" : "password"}
                  className="w-full px-3.5 py-2.5 pr-20 border border-slate-300 rounded-lg text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter staff password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded transition"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                >
                  {showLoginPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {pinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700 flex items-center gap-2">
                <span>✕</span> {typeof pinError === "string" ? pinError : "Incorrect staff password. Please try again."}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Log In to Service Desk &rarr;
            </button>

            {/* Quick helper info */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
              <p className="text-[11px] text-slate-400">
                You can change this password anytime in the <strong>Settings</strong> tab.
              </p>
            </div>

            <div className="text-center pt-2">
              <Link href="/" className="text-xs font-bold text-slate-500 hover:text-teal-700 transition">
                &larr; Back to Public Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: LOGGED-IN ADMIN ERP PANEL
  // -------------------------------------------------------------
  return (
    <div className="admin flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-white p-1 rounded-md shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SITE.logo} alt={SITE.name} className="h-6 w-auto object-contain" />
              </div>
              <div>
                <div className="font-extrabold text-xs tracking-wider text-amber-400 uppercase">STAFF ERP</div>
                <div className="text-[10px] text-slate-400">Chennai Operations</div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1.5">
            {[
              { id: "dashboard", label: "Dashboard", icon: "▦" },
              { id: "enquiries", label: "Enquiries & Leads", icon: "✉", count: openEnquiries.length },
              { id: "quotes", label: "Quotations", icon: "₹", count: quotesCount },
              { id: "jobs", label: "Jobs & Schedule", icon: "⚒", count: activeJobs.length },
              { id: "settings", label: "Settings", icon: "⚙" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold"
                    : "hover:bg-slate-900 text-slate-300 hover:text-white"
                }`}
                onClick={() => setCurrentTab(tab.id)}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-sm opacity-80">{tab.icon}</span>
                  {tab.label}
                </span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                      currentTab === tab.id ? "bg-slate-950 text-white" : "bg-slate-800 text-amber-400 border border-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Demo Data loader in sidebar */}
          <div className="px-3 mt-4">
            <button
              type="button"
              onClick={handleLoadSampleData}
              className="w-full text-left px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-bold text-amber-400 hover:text-amber-300 transition flex items-center gap-2"
              title="Loads Cognizant, TCS, Zoho, Freshworks sample leads"
            >
              <span>⚡</span> Load Chennai Demo Leads
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <Link href="/" target="_blank" className="text-slate-400 hover:text-white font-medium flex items-center gap-1">
            Website ↗
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded hover:bg-red-950/40 transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 capitalize tracking-tight flex items-center gap-2">
              <span>{currentTab === "dashboard" ? "Operations Dashboard" : currentTab}</span>
              <span className="text-xs font-normal text-slate-500">| Ayaan Enterprises Chennai</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold ml-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SQL Database Active
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="btn btn-sm btn-outline text-xs font-bold"
              onClick={() => setShowManualLeadModal(true)}
            >
              + Add Lead
            </button>
            <button
              type="button"
              className="btn btn-sm btn-amber text-xs font-bold"
              onClick={() => setShowNewQuoteModal(true)}
            >
              + New Quotation
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD                                          */}
          {/* ========================================================= */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Open Enquiries
                  </div>
                  <div className="text-3xl font-black text-blue-600">{openEnquiries.length}</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>Awaiting reply / quote</span>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("enquiries")}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      View &rarr;
                    </button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Active Repair Jobs
                  </div>
                  <div className="text-3xl font-black text-amber-600">{activeJobs.length}</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>On-site batch repairs</span>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("jobs")}
                      className="text-amber-600 hover:underline font-bold"
                    >
                      Schedule &rarr;
                    </button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Quotations Pipeline
                  </div>
                  <div className="text-3xl font-black text-emerald-600">
                    {formatCurrency(quotesPipelineValue)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>{quotesCount} quotes generated</span>
                    <button
                      type="button"
                      onClick={() => setCurrentTab("quotes")}
                      className="text-emerald-600 hover:underline font-bold"
                    >
                      Quotes &rarr;
                    </button>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Won Contracts
                  </div>
                  <div className="text-3xl font-black text-teal-600">{wonEnquiriesCount}</div>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>Enterprise POs approved</span>
                    <span className="text-teal-700 font-bold">100% Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Toolbar & Pipeline Funnel */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pipeline:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ENQ_STATUS.map((s) => {
                      const count = (data.enquiries || []).filter((e) => e.status === s).length;
                      return (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md"
                        >
                          <span>{s}:</span>
                          <span className="text-slate-900 font-black">{count}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleData}
                    className="btn btn-sm btn-outline text-xs"
                  >
                    ⚡ Demo Data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const json = JSON.stringify(data, null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Ayaan_ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                    }}
                    className="btn btn-sm btn-outline text-xs"
                  >
                    Export JSON
                  </button>
                </div>
              </div>

              {/* Recent Enquiries & Leads table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Recent Leads &amp; Enquiries
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentTab("enquiries")}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    View All Enquiries &rarr;
                  </button>
                </div>

                {(!data.enquiries || data.enquiries.length === 0) ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500 mb-3">
                      No customer enquiries in database yet.
                    </p>
                    <button
                      type="button"
                      onClick={handleLoadSampleData}
                      className="btn btn-sm btn-amber"
                    >
                      ⚡ Load Chennai Enterprise Demo Data
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Ref #</th>
                          <th className="py-3 px-4">Customer &amp; Company</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Qty</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.enquiries.slice(0, 8).map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{enq.id}</td>
                            <td className="py-3 px-4">
                              <div className="font-extrabold text-slate-900">{enq.name || "Customer"}</div>
                              <div className="text-[11px] text-slate-500">
                                {enq.company ? `${enq.company} · ` : ""}
                                {enq.city || "Chennai"}
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">{enq.service}</td>
                            <td className="py-3 px-4 font-black text-slate-900">{enq.quantity || 1}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] font-extrabold ${
                                  enq.status === "Won"
                                    ? "bg-green-100 text-green-800"
                                    : enq.status === "Quoted"
                                    ? "bg-blue-100 text-blue-800"
                                    : enq.status === "Inspection"
                                    ? "bg-amber-100 text-amber-800"
                                    : enq.status === "New"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <a
                                href={`https://wa.me/${String(enq.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hello ${enq.name || "Sir"}, Ayaan Enterprises Chennai here regarding your enquiry (${enq.id}) for ${enq.service} (${enq.quantity || 1} chairs).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-emerald-700 hover:text-emerald-900 font-bold"
                                title="Open WhatsApp chat"
                              >
                                💬 WhatsApp
                              </a>
                              <button
                                type="button"
                                className="text-teal-700 hover:text-teal-900 font-bold"
                                onClick={() => handleConvertEnquiryToQuote(enq)}
                              >
                                📄 Quote
                              </button>
                              <button
                                type="button"
                                className="text-slate-600 hover:text-slate-900 font-bold"
                                onClick={() => setSelectedEnquiry(enq)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ENQUIRIES & LEADS                                  */}
          {/* ========================================================= */}
          {currentTab === "enquiries" && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                  <input
                    type="search"
                    placeholder="Search by name, company, phone or location..."
                    className="p-2 border border-slate-300 rounded-lg text-xs flex-1 max-w-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  {/* Status Pills */}
                  <div className="flex flex-wrap gap-1">
                    {["All", ...ENQ_STATUS].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatusFilter(s)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                          statusFilter === s
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-amber"
                    onClick={() => setShowManualLeadModal(true)}
                  >
                    + Add New Lead
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {filteredEnquiries.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No matching enquiries found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Ref ID</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Customer / Company</th>
                          <th className="py-3 px-3">Phone</th>
                          <th className="py-3 px-3">Service</th>
                          <th className="py-3 px-3">Qty</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEnquiries.map((enq) => (
                          <tr key={enq.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{enq.id}</td>
                            <td className="py-3 px-3 text-slate-500">
                              {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString("en-IN") : "—"}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-extrabold text-slate-900">{enq.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {enq.company || enq.city || "Chennai"}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono">
                              <a href={`tel:${enq.phone}`} className="text-teal-700 hover:underline font-bold">
                                {enq.phone}
                              </a>
                            </td>
                            <td className="py-3 px-3 font-medium text-slate-800">{enq.service}</td>
                            <td className="py-3 px-3 font-black text-slate-900">{enq.quantity}</td>
                            <td className="py-3 px-3">
                              <select
                                value={enq.status}
                                onChange={(e) => {
                                  const newSt = e.target.value;
                                  updateStore((d) => {
                                    const target = d.enquiries.find((x) => x.id === enq.id);
                                    if (target) target.status = newSt;
                                    return d;
                                  });
                                }}
                                className="text-xs font-bold border border-slate-300 rounded px-2 py-1 bg-white"
                              >
                                {ENQ_STATUS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <a
                                href={`https://wa.me/${String(enq.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hi ${enq.name}, Ayaan Enterprises Chennai regarding your ${enq.service} requirement (${enq.id}).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 hover:underline font-bold"
                              >
                                WhatsApp
                              </a>
                              <button
                                type="button"
                                className="text-teal-700 hover:underline font-bold"
                                onClick={() => handleConvertEnquiryToQuote(enq)}
                              >
                                Quote
                              </button>
                              <button
                                type="button"
                                className="text-slate-600 hover:underline font-bold"
                                onClick={() => setSelectedEnquiry(enq)}
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:underline font-bold"
                                onClick={() => {
                                  if (confirm(`Delete enquiry ${enq.id}?`)) {
                                    updateStore((d) => {
                                      d.enquiries = d.enquiries.filter((x) => x.id !== enq.id);
                                      return d;
                                    });
                                  }
                                }}
                              >
                                &times;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: QUOTATIONS                                         */}
          {/* ========================================================= */}
          {currentTab === "quotes" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Official Client Quotations</h2>
                  <p className="text-xs text-slate-500">
                    Prepare, download printable invoices, or send quotes directly via WhatsApp
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-amber"
                  onClick={() => setShowNewQuoteModal(true)}
                >
                  + Generate Quotation
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {(!data.quotes || data.quotes.length === 0) ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No quotations created yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Quote #</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Customer &amp; Company</th>
                          <th className="py-3 px-3">Line Items</th>
                          <th className="py-3 px-3">Total (incl. GST)</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.quotes.map((q) => {
                          const subtotal = (q.items || []).reduce(
                            (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
                            0
                          );
                          const total = subtotal * (1 + (data.settings?.gstPct || 18) / 100);
                          return (
                            <tr key={q.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3 font-mono font-bold text-slate-900">{q.id}</td>
                              <td className="py-3 px-3 text-slate-500">
                                {q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-IN") : "—"}
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-extrabold text-slate-900">{q.customerName || "Customer"}</div>
                                <div className="text-[11px] text-slate-500">{q.company || q.phone}</div>
                              </td>
                              <td className="py-3 px-3 text-slate-600">{(q.items || []).length} items</td>
                              <td className="py-3 px-3 font-black text-slate-900 text-sm">
                                {formatCurrency(total)}
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  value={q.status}
                                  onChange={(e) => {
                                    const nextSt = e.target.value;
                                    updateStore((d) => {
                                      const target = d.quotes.find((x) => x.id === q.id);
                                      if (target) target.status = nextSt;
                                      return d;
                                    });
                                  }}
                                  className="text-xs font-bold border rounded px-2 py-1 bg-white"
                                >
                                  {QT_STATUS.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 px-3 text-right space-x-2">
                                <button
                                  type="button"
                                  className="text-teal-700 hover:underline font-bold"
                                  onClick={() => setSelectedQuote(q)}
                                >
                                  View / Print
                                </button>
                                <a
                                  href={`https://wa.me/${String(q.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(
                                    `*QUOTATION from Ayaan Enterprises Chennai*\nQuote Ref: ${q.id}\nClient: ${q.customerName} (${q.company || ""})\nTotal Amount (incl. 18% GST): ${formatCurrency(total)}\n\nKindly confirm for scheduling.`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline font-bold"
                                >
                                  Share WA
                                </a>
                                <button
                                  type="button"
                                  className="text-red-600 hover:underline font-bold"
                                  onClick={() => {
                                    if (confirm(`Delete quote ${q.id}?`)) {
                                      updateStore((d) => {
                                        d.quotes = d.quotes.filter((x) => x.id !== q.id);
                                        return d;
                                      });
                                    }
                                  }}
                                >
                                  &times;
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: JOBS & SCHEDULE                                    */}
          {/* ========================================================= */}
          {currentTab === "jobs" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">On-Site Work Orders &amp; Technician Schedule</h2>
                  <p className="text-xs text-slate-500">Track batched on-site repairs across Chennai office campuses</p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-amber"
                  onClick={() => setShowScheduleJobModal(true)}
                >
                  + Schedule Work Order
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {(!data.jobs || data.jobs.length === 0) ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No active work orders at present. Click above to schedule a batch repair job.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-3">Job ID</th>
                          <th className="py-3 px-3">Client &amp; Site</th>
                          <th className="py-3 px-3">Technician</th>
                          <th className="py-3 px-3">Chairs</th>
                          <th className="py-3 px-3">Scheduled Date</th>
                          <th className="py-3 px-3">Progress</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Manage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">{job.id}</td>
                            <td className="py-3 px-3 font-extrabold text-slate-900">{job.customerName}</td>
                            <td className="py-3 px-3 font-medium text-slate-700">{job.technician || "Unassigned"}</td>
                            <td className="py-3 px-3 font-black text-slate-900">{job.chairs || 1}</td>
                            <td className="py-3 px-3 text-slate-600 font-medium">{job.scheduledDate || "This Week"}</td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-teal-600 h-2 rounded-full"
                                    style={{ width: job.progress || "0%" }}
                                  />
                                </div>
                                <span className="font-bold text-[11px]">{job.progress || "0%"}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={job.status}
                                onChange={(e) => {
                                  const newSt = e.target.value;
                                  updateStore((d) => {
                                    const target = d.jobs.find((x) => x.id === job.id);
                                    if (target) {
                                      target.status = newSt;
                                      if (newSt === "Completed") target.progress = "100%";
                                    }
                                    return d;
                                  });
                                }}
                                className="text-xs font-bold border rounded px-2 py-1 bg-white"
                              >
                                {JOB_STATUS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button
                                type="button"
                                className="text-teal-700 hover:underline font-bold"
                                onClick={() => {
                                  const nextProg = prompt("Update batch completion percentage (e.g. 50%):", job.progress || "0%");
                                  if (nextProg !== null) {
                                    updateStore((d) => {
                                      const target = d.jobs.find((x) => x.id === job.id);
                                      if (target) target.progress = nextProg;
                                      return d;
                                    });
                                  }
                                }}
                              >
                                Update %
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:underline font-bold"
                                onClick={() => {
                                  if (confirm(`Remove job ${job.id}?`)) {
                                    updateStore((d) => {
                                      d.jobs = d.jobs.filter((x) => x.id !== job.id);
                                      return d;
                                    });
                                  }
                                }}
                              >
                                &times;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: SETTINGS & PASSWORD MANAGEMENT                     */}
          {/* ========================================================= */}
          {currentTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CARD 1: CHANGE STAFF LOGIN PASSWORD */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🔒</span>
                  <h2 className="text-base font-extrabold text-slate-900">Change Staff Login Password</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  Update the password required to access this service desk and admin panel.
                </p>

                {passwordFeedback && (
                  <div
                    className={`p-3.5 mb-5 rounded-lg text-xs font-bold border flex items-center gap-2 ${
                      passwordFeedback.type === "success"
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800"
                    }`}
                  >
                    <span>{passwordFeedback.type === "success" ? "✓" : "✕"}</span>
                    {passwordFeedback.message}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                    <div className="relative">
                      <input
                        type={showCurrPass ? "text" : "password"}
                        className="w-full p-2.5 pr-16 border border-slate-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-500"
                        placeholder="Enter current password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 rounded"
                        onClick={() => setShowCurrPass(!showCurrPass)}
                      >
                        {showCurrPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        className="w-full p-2.5 pr-16 border border-slate-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-500"
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 rounded"
                        onClick={() => setShowNewPass(!showNewPass)}
                      >
                        {showNewPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        className="w-full p-2.5 pr-16 border border-slate-300 rounded-lg font-medium focus:ring-1 focus:ring-amber-500"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-100 rounded"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                      >
                        {showConfirmPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg shadow-sm transition"
                  >
                    Update Staff Password
                  </button>
                </form>

                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Password Active:</span> Stored safely in your browser session and local database.
                </div>
              </div>

              {/* CARD 2: BUSINESS & INVOICING PROFILE */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏢</span>
                  <h2 className="text-base font-extrabold text-slate-900">Business &amp; Tax Settings</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  Details appearing on formal client quotations and official receipts.
                </p>

                {settingsFeedback && (
                  <div className="p-3 mb-4 rounded-lg text-xs font-bold bg-green-50 border border-green-300 text-green-800">
                    ✓ {settingsFeedback.message}
                  </div>
                )}

                <form onSubmit={handleSaveCompanySettings} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Trading Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                      value={companySettings.businessName}
                      onChange={(e) => setCompanySettings({ ...companySettings, businessName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Phone</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        placeholder="e.g. 33AABCA1234F1Z9"
                        value={companySettings.gstin}
                        onChange={(e) => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Workshop Address</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-slate-300 rounded-lg"
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Payment Details (for Quotes)</label>
                    <textarea
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                      value={companySettings.bank}
                      onChange={(e) => setCompanySettings({ ...companySettings, bank: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GST Rate (%)</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-slate-300 rounded-lg"
                        value={companySettings.gstPct}
                        onChange={(e) => setCompanySettings({ ...companySettings, gstPct: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-lg shadow-sm transition"
                  >
                    Save Business Profile
                  </button>
                </form>
              </div>

              {/* CARD 3: BACKUP, RESTORE & DEMO TOOLS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💾</span>
                  <h2 className="text-base font-extrabold text-slate-900">Data Management &amp; Enterprise Demo Tools</h2>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Export your database as JSON or populate realistic Chennai client leads (Cognizant, TCS, Zoho, Freshworks) for demonstrations.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleLoadSampleData}
                    className="btn btn-sm btn-amber"
                  >
                    ⚡ Load 5 Enterprise Chennai Demo Leads &amp; Quotes
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const json = JSON.stringify(data, null, 2);
                      const blob = new Blob([json], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `Ayaan_ERP_Backup_${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    Download Full JSON Backup
                  </button>

                  <button
                    type="button"
                    onClick={handleClearAllData}
                    className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                  >
                    Clear All Enquiries &amp; Quotes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: ADD MANUAL ENQUIRY / WALK-IN LEAD                */}
      {/* ========================================================= */}
      {showManualLeadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Add Manual Customer Lead</h3>
                <p className="text-xs text-slate-500">Record a phone call, walk-in, or direct WhatsApp enquiry</p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setShowManualLeadModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. Rajesh Kumar"
                    value={manualLeadForm.name}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company / Office</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. HCL Technologies"
                    value={manualLeadForm.company}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="+91 98401 23456"
                    value={manualLeadForm.phone}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chennai Area / Campus</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    placeholder="e.g. OMR, Guindy, Porur"
                    value={manualLeadForm.city}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Required</label>
                  <select
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    value={manualLeadForm.service}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, service: e.target.value })}
                  >
                    <option value="Chair Repair & Spares">Chair Repair &amp; Spares</option>
                    <option value="Chair Deep Cleaning">Chair Deep Cleaning</option>
                    <option value="Buy New Office Chairs">Buy New Office Chairs</option>
                    <option value="Bulk Annual Maintenance (AMC)">Bulk AMC Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chair Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={manualLeadForm.quantity}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, quantity: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reported Issue / Requirement</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Sinking gas cylinder, broken castors"
                  value={manualLeadForm.problem}
                  onChange={(e) => setManualLeadForm({ ...manualLeadForm, problem: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff Notes</label>
                <textarea
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="Any specific technician instructions or client notes"
                  value={manualLeadForm.notes}
                  onChange={(e) => setManualLeadForm({ ...manualLeadForm, notes: e.target.value })}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowManualLeadModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-amber font-bold">
                  Save Customer Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE NEW QUOTATION                             */}
      {/* ========================================================= */}
      {showNewQuoteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Create Official Quotation</h3>
                <p className="text-xs text-slate-500">Calculate line items, GST, and terms for Chennai client</p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setShowNewQuoteModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Client Name *"
                  className="p-2 border border-slate-300 rounded-lg"
                  value={newQuoteCustomer.name}
                  onChange={(e) => setNewQuoteCustomer({ ...newQuoteCustomer, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company / Office"
                  className="p-2 border border-slate-300 rounded-lg"
                  value={newQuoteCustomer.company}
                  onChange={(e) => setNewQuoteCustomer({ ...newQuoteCustomer, company: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  className="p-2 border border-slate-300 rounded-lg"
                  value={newQuoteCustomer.phone}
                  onChange={(e) => setNewQuoteCustomer({ ...newQuoteCustomer, phone: e.target.value })}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700 uppercase">Items &amp; Service Rates</label>
                  <select
                    className="p-1 text-[11px] border rounded bg-slate-50"
                    onChange={(e) => {
                      const sel = PRESETS.find((p) => p.desc === e.target.value);
                      if (sel) {
                        setNewQuoteItems([...newQuoteItems, { desc: sel.desc, qty: 10, rate: sel.rate }]);
                      }
                      e.target.value = "";
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      + Quick Add from Presets...
                    </option>
                    {PRESETS.map((p, i) => (
                      <option key={i} value={p.desc}>
                        {p.desc} ({data.settings?.currency || "₹"}{p.rate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {newQuoteItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="p-2 border border-slate-300 rounded-lg flex-1"
                        placeholder="Item / service description"
                        value={item.desc}
                        onChange={(e) => {
                          const copy = [...newQuoteItems];
                          copy[idx].desc = e.target.value;
                          setNewQuoteItems(copy);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-16 p-2 border border-slate-300 rounded-lg text-center"
                        value={item.qty}
                        onChange={(e) => {
                          const copy = [...newQuoteItems];
                          copy[idx].qty = Number(e.target.value);
                          setNewQuoteItems(copy);
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        className="w-24 p-2 border border-slate-300 rounded-lg text-right"
                        value={item.rate}
                        onChange={(e) => {
                          const copy = [...newQuoteItems];
                          copy[idx].rate = Number(e.target.value);
                          setNewQuoteItems(copy);
                        }}
                      />
                      <span className="w-24 text-right font-mono font-bold">
                        {formatCurrency((item.qty || 0) * (item.rate || 0))}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 font-bold px-1 text-sm hover:text-red-700"
                        onClick={() => setNewQuoteItems(newQuoteItems.filter((_, i) => i !== idx))}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-2 text-xs text-teal-700 font-bold hover:underline"
                  onClick={() =>
                    setNewQuoteItems([...newQuoteItems, { desc: "Custom on-site servicing", qty: 1, rate: 500 }])
                  }
                >
                  + Add Custom Row
                </button>
              </div>

              {/* Totals computation */}
              <div className="pt-3 border-t bg-slate-50 p-3 rounded-lg space-y-1 text-right">
                {(() => {
                  const subtotal = newQuoteItems.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0);
                  const gst = subtotal * ((data.settings?.gstPct || 18) / 100);
                  const total = subtotal + gst;
                  return (
                    <>
                      <div className="text-slate-600">
                        Subtotal: <strong className="font-mono">{formatCurrency(subtotal)}</strong>
                      </div>
                      <div className="text-slate-600">
                        GST ({data.settings?.gstPct || 18}%): <strong className="font-mono">{formatCurrency(gst)}</strong>
                      </div>
                      <div className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                        Grand Total: <span className="font-mono">{formatCurrency(total)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowNewQuoteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-amber font-extrabold"
                  onClick={() => {
                    const qId = Store.nextId(data, "QT");
                    const newQuote = {
                      id: qId,
                      customerName: newQuoteCustomer.name || "Customer",
                      company: newQuoteCustomer.company,
                      phone: newQuoteCustomer.phone,
                      items: newQuoteItems,
                      status: "Sent",
                      createdAt: new Date().toISOString()
                    };
                    updateStore((d) => {
                      d.quotes = d.quotes || [];
                      d.quotes.unshift(newQuote);
                      return d;
                    });
                    setShowNewQuoteModal(false);
                    setSelectedQuote(newQuote);
                  }}
                >
                  Generate &amp; Preview Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: SCHEDULE WORK ORDER                              */}
      {/* ========================================================= */}
      {showScheduleJobModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Schedule Work Order</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setShowScheduleJobModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleScheduleJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer / Campus *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS Siruseri or DLF Porur"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  value={jobForm.customerName}
                  onChange={(e) => setJobForm({ ...jobForm, customerName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={jobForm.phone}
                    onChange={(e) => setJobForm({ ...jobForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chairs Count</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={jobForm.chairs}
                    onChange={(e) => setJobForm({ ...jobForm, chairs: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Technician</label>
                  <select
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    value={jobForm.technician}
                    onChange={(e) => setJobForm({ ...jobForm, technician: e.target.value })}
                  >
                    {(data.technicians || ["Ramesh", "Suresh", "Imran", "Vikas"]).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date / Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow 10 AM"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                    value={jobForm.scheduledDate}
                    onChange={(e) => setJobForm({ ...jobForm, scheduledDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Notes</label>
                <textarea
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Floor 2 workstations, bring 20 gas lifts"
                  value={jobForm.notes}
                  onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setShowScheduleJobModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-amber font-bold">
                  Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ENQUIRY DETAILS DRAWER                           */}
      {/* ========================================================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Enquiry Details: {selectedEnquiry.id}
                </h3>
                <span className="text-xs text-slate-500">
                  Received on {selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleString("en-IN") : "Recent"}
                </span>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setSelectedEnquiry(null)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-sm font-bold text-slate-900">{selectedEnquiry.name}</div>
                <div className="text-slate-600 font-medium">
                  {selectedEnquiry.company ? `${selectedEnquiry.company} · ` : ""}
                  {selectedEnquiry.city || "Chennai"}
                </div>
                <div className="mt-1 font-mono text-teal-800 font-bold">{selectedEnquiry.phone}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border">
                  <span className="text-slate-500 block">Service</span>
                  <strong className="text-slate-900">{selectedEnquiry.service}</strong>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border">
                  <span className="text-slate-500 block">Chair Quantity</span>
                  <strong className="text-slate-900 text-sm">{selectedEnquiry.quantity || 1} chairs</strong>
                </div>
              </div>

              {selectedEnquiry.chairTypes && selectedEnquiry.chairTypes.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Chair Models:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedEnquiry.chairTypes.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEnquiry.problems && selectedEnquiry.problems.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Reported Issues:</span>
                  <ul className="list-disc list-inside text-slate-700">
                    {selectedEnquiry.problems.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEnquiry.message && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Customer Note:</span>
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-slate-800 whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}

              {selectedEnquiry.photos && selectedEnquiry.photos.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Attached Damage Photos:</span>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {selectedEnquiry.photos.map((src, i) => (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt="Chair condition"
                          className="w-16 h-16 object-cover rounded-lg border border-slate-300 hover:scale-105 transition"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t flex items-center justify-between">
              <a
                href={`https://wa.me/${String(selectedEnquiry.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hi ${selectedEnquiry.name}, Ayaan Enterprises Chennai regarding your ${selectedEnquiry.service} inquiry (${selectedEnquiry.id}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-wa"
              >
                Chat on WhatsApp
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-amber"
                  onClick={() => {
                    setSelectedEnquiry(null);
                    handleConvertEnquiryToQuote(selectedEnquiry);
                  }}
                >
                  Generate Quote
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: PRINTABLE OFFICIAL QUOTATION PREVIEW             */}
      {/* ========================================================= */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[92vh] overflow-y-auto shadow-2xl relative">
            {/* Action Bar (hidden when printing) */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-amber"
                  onClick={() => window.print()}
                >
                  🖨️ Print Quotation
                </button>
                <a
                  href={`https://wa.me/${String(selectedQuote.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(
                    `*QUOTATION from Ayaan Enterprises Chennai*\nQuote Ref: ${selectedQuote.id}\nClient: ${selectedQuote.customerName} (${selectedQuote.company || ""})\nAmount: ${formatCurrency(
                      (selectedQuote.items || []).reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0), 0) *
                        (1 + (data.settings?.gstPct || 18) / 100)
                    )}\nWarranty: 90 Days comprehensive on hydraulic parts.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-wa"
                >
                  WhatsApp to Client
                </a>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                onClick={() => setSelectedQuote(null)}
              >
                &times;
              </button>
            </div>

            {/* Official Letterhead */}
            <div className="doc space-y-5 text-xs text-slate-800">
              <div className="flex justify-between items-start border-b-2 border-teal-600 pb-4">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SITE.logo} alt={SITE.name} className="h-10 object-contain mb-1" />
                  <div className="font-extrabold text-sm text-slate-900">{data.settings?.businessName || SITE.name}</div>
                  <div className="text-[11px] text-slate-500 max-w-xs">{data.settings?.address || SITE.address}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Phone: {data.settings?.phone || SITE.phone} | GSTIN: {data.settings?.gstin || "33AABCA1234F1Z9"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-teal-800 tracking-tight">OFFICIAL QUOTATION</div>
                  <div className="font-mono font-bold text-slate-900 mt-1">Ref: {selectedQuote.id}</div>
                  <div className="text-slate-500 text-[11px]">
                    Date: {selectedQuote.createdAt ? new Date(selectedQuote.createdAt).toLocaleDateString("en-IN") : "Today"}
                  </div>
                  <div className="text-slate-500 text-[11px]">Valid: 15 Days</div>
                </div>
              </div>

              {/* Client info */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Billed To / Client
                </span>
                <div className="font-extrabold text-slate-900 text-sm">{selectedQuote.customerName}</div>
                {selectedQuote.company && <div className="text-slate-700 font-medium">{selectedQuote.company}</div>}
                {selectedQuote.phone && <div className="text-slate-600 font-mono">{selectedQuote.phone}</div>}
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead className="bg-slate-900 text-white text-[11px]">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Description of Work / Spare Part</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Rate</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(selectedQuote.items || []).map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 px-3 font-mono text-slate-500">{i + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{item.desc}</td>
                      <td className="py-2 px-3 text-center font-bold">{item.qty}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatCurrency(item.rate)}</td>
                      <td className="py-2 px-3 text-right font-mono font-extrabold">
                        {formatCurrency((item.qty || 0) * (item.rate || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-right font-mono text-xs">
                  {(() => {
                    const subtotal = (selectedQuote.items || []).reduce(
                      (s, i) => s + (Number(i.qty) || 0) * (Number(i.rate) || 0),
                      0
                    );
                    const gst = subtotal * ((data.settings?.gstPct || 18) / 100);
                    const grand = subtotal + gst;
                    return (
                      <>
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>GST ({data.settings?.gstPct || 18}%):</span>
                          <span>{formatCurrency(gst)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t-2 border-slate-900">
                          <span>Grand Total:</span>
                          <span>{formatCurrency(grand)}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Payment & Terms */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[11px] text-slate-600">
                <div>
                  <strong className="block text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                    Bank Transfer Details:
                  </strong>
                  <pre className="font-mono text-[10px] whitespace-pre-wrap bg-slate-50 p-2 rounded border">
                    {data.settings?.bank || "HDFC Bank | A/c 50200081223388 | IFSC: HDFC0001234"}
                  </pre>
                </div>
                <div>
                  <strong className="block text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                    Standard Service Terms:
                  </strong>
                  <p className="whitespace-pre-wrap text-[10px] leading-relaxed">
                    {data.settings?.quoteTerms ||
                      "1. 90-day comprehensive warranty on replaced parts.\n2. Work carried out in batches to prevent disruption.\n3. 50% mobilization advance, balance on completion."}
                  </p>
                </div>
              </div>

              {/* Authorized Signatory */}
              <div className="pt-6 flex justify-between items-end text-[11px]">
                <div className="text-slate-400">Ayaan Enterprises · Chennai Industrial Division</div>
                <div className="text-center">
                  <div className="w-40 border-b border-slate-400 mb-1" />
                  <span className="font-bold text-slate-700">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
