"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import HeaderBox from "@/components/HeaderBox";
import { useBank } from "@/context/BankContext";
import { formatAmount } from "@/lib/utils";
import { toast } from "sonner";
import {
  Building2,
  Smartphone,
  QrCode,
  ArrowRightLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Repeat,
  Calendar,
  Search,
  Plus,
  ArrowUpRight,
  Receipt,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Lock,
  ChevronRight,
  UserCheck,
  Fingerprint,
  RefreshCw,
  Download,
  Info,
} from "lucide-react";

// Predefined frequent beneficiaries
interface Beneficiary {
  id: string;
  name: string;
  type: "bank" | "upi" | "phone";
  accountNumber?: string;
  ifsc?: string;
  bankName?: string;
  upiId?: string;
  phone?: string;
  avatarColor: string;
  category: string;
}

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben_1",
    name: "Priya Sharma",
    type: "upi",
    upiId: "priyasharma@okaxis",
    avatarColor: "bg-emerald-500",
    category: "Family & Friends",
  },
  {
    id: "ben_2",
    name: "Rahul Verma",
    type: "bank",
    accountNumber: "987654321098",
    ifsc: "HDFC0001234",
    bankName: "HDFC Bank",
    avatarColor: "bg-blue-500",
    category: "Food & Split",
  },
  {
    id: "ben_3",
    name: "Landlord (Rent)",
    type: "bank",
    accountNumber: "554433221100",
    ifsc: "SBIN0004567",
    bankName: "State Bank of India",
    avatarColor: "bg-purple-500",
    category: "Rent & Housing",
  },
  {
    id: "ben_4",
    name: "Aman Gupta",
    type: "phone",
    phone: "9876543210",
    avatarColor: "bg-amber-500",
    category: "Family & Friends",
  },
  {
    id: "ben_5",
    name: "Electricity Board",
    type: "bank",
    accountNumber: "889977665544",
    ifsc: "ICIC0000987",
    bankName: "ICICI Bank",
    avatarColor: "bg-rose-500",
    category: "Bills & Utilities",
  },
];

const CATEGORIES = [
  { label: "Transfer & Split", icon: "💸" },
  { label: "Food & Dining", icon: "🍔" },
  { label: "Rent & Housing", icon: "🏠" },
  { label: "Bills & Utilities", icon: "💡" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Family & Friends", icon: "❤️" },
  { label: "Investment", icon: "📈" },
  { label: "Entertainment", icon: "🎬" },
  { label: "Other", icon: "✨" },
];

const AMOUNT_PRESETS = [500, 1000, 2000, 5000, 10000];

export default function PaymentTransfer() {
  const { accounts, transactions, addTransaction, updateAccountBalance } = useBank();

  // Active Transfer Method Tab
  const [transferMode, setTransferMode] = useState<"bank" | "upi" | "internal" | "qr" | "phone">("bank");

  // Selected Source Account (defaults to first account)
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || "");

  // Update selected account if accounts load/change
  useEffect(() => {
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  // Form Fields
  const [targetAccount, setTargetAccount] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [detectedBank, setDetectedBank] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [internalTargetAccountId, setInternalTargetAccountId] = useState("");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Transfer & Split");
  const [note, setNote] = useState("");
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);

  // Transfer Speed / Schedule
  const [transferSpeed, setTransferSpeed] = useState<"instant" | "scheduled" | "recurring">("instant");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurringFrequency, setRecurringFrequency] = useState<"weekly" | "monthly">("monthly");

  // Beneficiaries State
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("finman_beneficiaries");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_BENEFICIARIES;
        }
      }
    }
    return INITIAL_BENEFICIARIES;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("finman_beneficiaries", JSON.stringify(beneficiaries));
    }
  }, [beneficiaries]);

  // Modals & States
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [securityPin, setSecurityPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<any | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // QR Scanner Simulation State
  const [qrScanning, setQrScanning] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [activeQrView, setActiveQrView] = useState<"scan" | "my_qr">("scan");

  // Filter for Recent Transfers Feed
  const [transferSearch, setTransferSearch] = useState("");

  // Selected Source Account Object
  const sourceAccount = useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Destination Internal Account
  const internalTargetAccount = useMemo(() => {
    return accounts.find((a) => a.id === internalTargetAccountId) || accounts.find((a) => a.id !== selectedAccountId);
  }, [accounts, internalTargetAccountId, selectedAccountId]);

  // Auto-detect Bank based on IFSC
  useEffect(() => {
    if (ifscCode.length >= 4) {
      const prefix = ifscCode.substring(0, 4).toUpperCase();
      if (prefix === "HDFC") setDetectedBank("HDFC Bank Ltd.");
      else if (prefix === "SBIN") setDetectedBank("State Bank of India");
      else if (prefix === "ICIC") setDetectedBank("ICICI Bank Ltd.");
      else if (prefix === "UTIB" || prefix === "AXIS") setDetectedBank("Axis Bank Ltd.");
      else if (prefix === "KKBK") setDetectedBank("Kotak Mahindra Bank");
      else if (prefix === "PUNB") setDetectedBank("Punjab National Bank");
      else if (prefix === "BARB") setDetectedBank("Bank of Baroda");
      else setDetectedBank("Recognized Scheduled Bank");
    } else {
      setDetectedBank("");
    }
  }, [ifscCode]);

  // UPI verification simulation
  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., name@okaxis)");
      return;
    }
    toast.loading("Verifying UPI ID with NPCI...", { id: "upi-verify" });
    setTimeout(() => {
      setIsUpiVerified(true);
      const namePart = upiId.split("@")[0].replace(".", " ");
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      setBeneficiaryName(formattedName);
      toast.success(`Verified: ${formattedName}`, { id: "upi-verify" });
    }, 600);
  };

  // Quick Amount preset handler
  const handleAmountPreset = (preset: number) => {
    const current = Number(amount) || 0;
    setAmount((current + preset).toString());
  };

  const handleMaxAmount = () => {
    if (sourceAccount) {
      setAmount(sourceAccount.currentBalance.toString());
    }
  };

  // Select a frequent beneficiary
  const handleSelectBeneficiary = (ben: Beneficiary) => {
    setBeneficiaryName(ben.name);
    setCategory(ben.category || "Transfer & Split");

    if (ben.type === "bank") {
      setTransferMode("bank");
      setTargetAccount(ben.accountNumber || "");
      setConfirmAccount(ben.accountNumber || "");
      setIfscCode(ben.ifsc || "HDFC0001234");
    } else if (ben.type === "upi") {
      setTransferMode("upi");
      setUpiId(ben.upiId || "");
      setIsUpiVerified(true);
    } else if (ben.type === "phone") {
      setTransferMode("phone");
      setPhoneNumber(ben.phone || "");
    }
    toast.info(`Selected ${ben.name}`);
  };

  // Swap Internal Accounts
  const handleSwapInternalAccounts = () => {
    if (!internalTargetAccount || !sourceAccount) return;
    const oldSourceId = sourceAccount.id;
    setSelectedAccountId(internalTargetAccount.id);
    setInternalTargetAccountId(oldSourceId);
  };

  // Validate form before opening Review Modal
  const handleInitiateTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sourceAccount) {
      toast.error("Please select a valid source bank account.");
      return;
    }

    const transferAmount = Number(amount);
    if (!transferAmount || transferAmount <= 0) {
      toast.error("Please enter a valid transfer amount greater than 0.");
      return;
    }

    if (sourceAccount.currentBalance < transferAmount) {
      toast.error("Insufficient balance in selected account.");
      return;
    }

    // Mode-specific validations
    if (transferMode === "bank") {
      if (!targetAccount || targetAccount.length < 8) {
        toast.error("Please enter a valid recipient account number.");
        return;
      }
      if (targetAccount !== confirmAccount) {
        toast.error("Account numbers do not match.");
        return;
      }
      if (!ifscCode || ifscCode.length < 5) {
        toast.error("Please enter a valid IFSC code.");
        return;
      }
      if (!beneficiaryName.trim()) {
        toast.error("Please enter the beneficiary full name.");
        return;
      }
    } else if (transferMode === "upi") {
      if (!upiId || !upiId.includes("@")) {
        toast.error("Please enter a valid UPI ID (e.g. name@okhdfcbank).");
        return;
      }
    } else if (transferMode === "internal") {
      if (!internalTargetAccount || internalTargetAccount.id === sourceAccount.id) {
        toast.error("Please select a different destination bank account.");
        return;
      }
    } else if (transferMode === "phone") {
      if (!phoneNumber || phoneNumber.length < 10) {
        toast.error("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!beneficiaryName.trim()) {
        toast.error("Please enter recipient name.");
        return;
      }
    } else if (transferMode === "qr") {
      if (!qrScanned) {
        toast.error("Please scan a valid payment QR code first.");
        return;
      }
    }

    // Reset PIN and open Review Modal
    setSecurityPin(["", "", "", ""]);
    setPinError(false);
    setIsReviewOpen(true);
  };

  // PIN Input Handling
  const handlePinChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...securityPin];
    newPin[index] = val.slice(-1);
    setSecurityPin(newPin);
    setPinError(false);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !securityPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Execute the confirmed transfer
  const handleFinalSubmit = () => {
    const pinStr = securityPin.join("");
    if (pinStr.length < 4) {
      setPinError(true);
      toast.error("Please enter your 4-digit Security PIN.");
      return;
    }

    setIsProcessing(true);

    const transferAmount = Number(amount);
    const dateStr = transferSpeed === "scheduled" ? scheduledDate : new Date().toISOString().split("T")[0];
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const txnRef = `TXN${Date.now().toString().slice(-8)}`;

    let recipientDisplay = beneficiaryName;
    if (transferMode === "bank") {
      recipientDisplay = beneficiaryName ? `${beneficiaryName} (A/C: ••${targetAccount.slice(-4)})` : `A/C ••${targetAccount.slice(-4)}`;
    } else if (transferMode === "upi") {
      recipientDisplay = upiId;
    } else if (transferMode === "internal") {
      recipientDisplay = internalTargetAccount?.name || "Self Account";
    } else if (transferMode === "phone") {
      recipientDisplay = `${beneficiaryName} (+91 ${phoneNumber})`;
    } else if (transferMode === "qr") {
      recipientDisplay = "Merchant QR / Retailer";
    }

    setTimeout(() => {
      // 1. Deduct from source account
      updateAccountBalance(sourceAccount.id, transferAmount, "debit");

      // 2. If internal transfer, also credit target account
      if (transferMode === "internal" && internalTargetAccount) {
        updateAccountBalance(internalTargetAccount.id, transferAmount, "credit");

        const internalCreditTxn = {
          id: `txn_${Date.now()}_cr`,
          $id: `txn_${Date.now()}_cr`,
          name: `Transfer from ${sourceAccount.name}`,
          paymentChannel: "online",
          type: "credit",
          accountId: internalTargetAccount.id,
          amount: transferAmount,
          pending: false,
          category: category || "Transfer",
          date: dateStr,
          image: "/icons/dollar-circle.svg",
        };
        addTransaction(internalCreditTxn);
      }

      // 3. Add debit transaction record
      const newTxn = {
        id: `txn_${Date.now()}`,
        $id: `txn_${Date.now()}`,
        name: note ? `${recipientDisplay} - ${note}` : `Transfer to ${recipientDisplay}`,
        paymentChannel: transferMode === "upi" || transferMode === "qr" ? "online" : "bank_transfer",
        type: "debit",
        accountId: sourceAccount.id,
        amount: transferAmount,
        pending: transferSpeed === "scheduled",
        category: category || "Transfer",
        date: dateStr,
        image: "/icons/money-send.svg",
      };
      addTransaction(newTxn);

      // 4. Save beneficiary if checked
      if (saveAsBeneficiary && beneficiaryName.trim()) {
        const newBen: Beneficiary = {
          id: `ben_${Date.now()}`,
          name: beneficiaryName,
          type: transferMode === "upi" ? "upi" : transferMode === "phone" ? "phone" : "bank",
          accountNumber: targetAccount,
          ifsc: ifscCode,
          bankName: detectedBank,
          upiId: upiId,
          phone: phoneNumber,
          avatarColor: ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"][
            Math.floor(Math.random() * 5)
          ],
          category: category,
        };
        setBeneficiaries((prev) => [newBen, ...prev.filter((b) => b.name !== beneficiaryName)]);
      }

      setIsProcessing(false);
      setIsReviewOpen(false);

      // Save completed transaction for receipt modal
      const receiptData = {
        refId: txnRef,
        amount: transferAmount,
        senderAccount: sourceAccount,
        recipient: recipientDisplay,
        transferMode,
        category,
        note,
        date: dateStr,
        time: timestamp,
        speed: transferSpeed,
        isScheduled: transferSpeed === "scheduled",
      };
      setCompletedTxn(receiptData);

      toast.success(
        transferSpeed === "scheduled"
          ? `Transfer of ${formatAmount(transferAmount)} scheduled for ${dateStr}!`
          : `Payment of ${formatAmount(transferAmount)} to ${recipientDisplay} completed successfully!`
      );

      // Reset Form
      setAmount("");
      setNote("");
      setTargetAccount("");
      setConfirmAccount("");
      setIfscCode("");
      setBeneficiaryName("");
      setUpiId("");
      setPhoneNumber("");
      setIsUpiVerified(false);
      setQrScanned(false);
      setSaveAsBeneficiary(false);
    }, 1200);
  };

  // Repeat transfer helper
  const handleRepeatTransfer = (txn: any) => {
    const rawAmt = Math.abs(txn.amount);
    setAmount(rawAmt.toString());
    setCategory(txn.category || "Transfer & Split");
    setNote(`Repeat of ${txn.name}`);
    if (txn.accountId && accounts.some((a) => a.id === txn.accountId)) {
      setSelectedAccountId(txn.accountId);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`Loaded transfer of ${formatAmount(rawAmt)} into form`);
  };

  // Filtered recent transfers list
  const recentTransfers = useMemo(() => {
    return transactions
      .filter((t) => {
        const isTransferType =
          t.type === "debit" ||
          t.category?.toLowerCase().includes("transfer") ||
          t.name.toLowerCase().includes("transfer");
        if (!isTransferType) return false;
        if (!transferSearch) return true;
        const q = transferSearch.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
        );
      })
      .slice(0, 8);
  }, [transactions, transferSearch]);

  return (
    <section className="payment-transfer min-h-screen bg-gradient-to-b from-gray-50/50 via-gray-25 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 dark:border-gray-800/80 pb-6">
        <HeaderBox
          title="Payment Transfer"
          subtext="Fast, secure, and multi-channel funds transfer to any account, UPI, or contact."
        />

        {/* Security / Feature Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-xs">
            <Zap className="size-3.5" />
            <span>Instant 24/7 IMPS</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold shadow-xs">
            <ShieldCheck className="size-3.5" />
            <span>256-bit Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>₹0 Fee Transfer</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Transfer Form Area (Left 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Step 1: Select Source Bank Account */}
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-5 sm:p-6 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                  1
                </span>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Select Debit Account
                </h2>
              </div>
              <Link
                href="/add-bank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Plus className="size-3.5" /> Link New Bank
              </Link>
            </div>

            {/* Visual Bank Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accounts.map((acc) => {
                const isSelected = acc.id === sourceAccount?.id;
                const isLowBalance = acc.currentBalance < (Number(amount) || 0);

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`relative text-left p-4 rounded-xl border transition-all duration-200 group overflow-hidden ${
                      isSelected
                        ? "border-blue-600 bg-gradient-to-br from-blue-50/80 via-white to-sky-50/50 dark:from-blue-950/40 dark:via-gray-900 dark:to-gray-900 shadow-md ring-2 ring-blue-500/30"
                        : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70"
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs ${
                            isSelected
                              ? "bg-gradient-to-tr from-blue-600 to-indigo-600"
                              : "bg-gray-700 dark:bg-gray-600"
                          }`}
                        >
                          <Building2 className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                            {acc.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            •••• {acc.mask || "1234"} •{" "}
                            <span className="capitalize">{acc.subtype || "checking"}</span>
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="size-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Balance */}
                    <div className="flex items-baseline justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Available</span>
                      <span
                        className={`text-base font-bold font-ibm-plex-serif ${
                          isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {formatAmount(acc.currentBalance)}
                      </span>
                    </div>

                    {isLowBalance && Number(amount) > 0 && isSelected && (
                      <p className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="size-3" /> Insufficient balance for this transfer
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Remaining Balance Calculation */}
            {sourceAccount && Number(amount) > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  Estimated balance after debit:
                </span>
                <span
                  className={`font-semibold font-ibm-plex-serif ${
                    sourceAccount.currentBalance - Number(amount) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {formatAmount(Math.max(0, sourceAccount.currentBalance - Number(amount)))}
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Transfer Channel & Recipient Details */}
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-5 sm:p-6 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                  2
                </span>
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Transfer Mode & Recipient
                </h2>
              </div>
            </div>

            {/* Frequent Payees Avatar Row */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
                Quick Pay / Favorites
              </p>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {beneficiaries.map((ben) => (
                  <button
                    key={ben.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(ben)}
                    className="flex flex-col items-center gap-1.5 min-w-[76px] p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center group cursor-pointer"
                  >
                    <div
                      className={`size-11 rounded-full ${ben.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform ring-2 ring-white dark:ring-gray-900`}
                    >
                      {ben.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate w-16 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {ben.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setTransferMode("bank")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  transferMode === "bank"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Building2 className="size-4" />
                <span>Bank / IFSC</span>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode("upi")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  transferMode === "upi"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Sparkles className="size-4" />
                <span>UPI ID / VPA</span>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode("internal")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  transferMode === "internal"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <ArrowRightLeft className="size-4" />
                <span>Self Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode("qr")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  transferMode === "qr"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <QrCode className="size-4" />
                <span>Scan & Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setTransferMode("phone")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all col-span-2 sm:col-span-1 ${
                  transferMode === "phone"
                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <Smartphone className="size-4" />
                <span>Phone / Contact</span>
              </button>
            </div>

            {/* Tab Form Contents */}
            <form onSubmit={handleInitiateTransfer} className="space-y-4">
              {/* TAB 1: BANK TRANSFER */}
              {transferMode === "bank" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Beneficiary Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        IFSC Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. HDFC0001234"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          required
                          maxLength={11}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm font-mono uppercase text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                        {detectedBank && (
                          <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            {detectedBank}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Account Number
                      </label>
                      <input
                        type="password"
                        placeholder="Enter 9 to 18 digits"
                        value={targetAccount}
                        onChange={(e) => setTargetAccount(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Confirm Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Re-enter account number"
                        value={confirmAccount}
                        onChange={(e) => setConfirmAccount(e.target.value)}
                        required
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 ${
                          confirmAccount && confirmAccount !== targetAccount
                            ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500/30"
                            : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-blue-500/30 focus:border-blue-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: UPI ID TRANSFER */}
              {transferMode === "upi" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okaxis"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setIsUpiVerified(false);
                          }}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                        {isUpiVerified && (
                          <span className="absolute right-3 top-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="size-4" /> Verified
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyUpi}
                        className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
                      >
                        Verify
                      </button>
                    </div>

                    {/* Quick UPI Handle suggestions */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-gray-400">Quick suffix:</span>
                      {["@okaxis", "@okhdfcbank", "@paytm", "@ybl", "@sbi"].map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          onClick={() => {
                            const base = upiId.split("@")[0] || "user";
                            setUpiId(`${base}${handle}`);
                            setIsUpiVerified(false);
                          }}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        >
                          {handle}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isUpiVerified && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-3">
                      <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                        <UserCheck className="size-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                          Registered Payee Name: {beneficiaryName || "Verified User"}
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          NPCI VPA Status: Active & Ready for Instant Settlement
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INTERNAL ACCOUNT TRANSFER */}
              {transferMode === "internal" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50">
                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-3">
                      Move money instantly between your linked bank accounts with zero charges.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      {/* From Account */}
                      <div className="flex-1 w-full p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <span className="text-[11px] font-semibold text-gray-500 uppercase">From</span>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {sourceAccount?.name}
                        </p>
                        <p className="text-xs text-gray-500">Balance: {formatAmount(sourceAccount?.currentBalance || 0)}</p>
                      </div>

                      {/* Swap Button */}
                      <button
                        type="button"
                        onClick={handleSwapInternalAccounts}
                        className="p-2.5 rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700 hover:rotate-180 transition-all duration-300 cursor-pointer"
                        title="Swap Accounts"
                      >
                        <ArrowRightLeft className="size-4" />
                      </button>

                      {/* To Account Select */}
                      <div className="flex-1 w-full p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <span className="text-[11px] font-semibold text-gray-500 uppercase">To (Destination)</span>
                        <select
                          value={internalTargetAccountId || internalTargetAccount?.id}
                          onChange={(e) => setInternalTargetAccountId(e.target.value)}
                          className="w-full text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-hidden cursor-pointer"
                        >
                          {accounts
                            .filter((a) => a.id !== sourceAccount?.id)
                            .map((acc) => (
                              <option key={acc.id} value={acc.id} className="dark:bg-gray-900">
                                {acc.name} (•••• {acc.mask}) - {formatAmount(acc.currentBalance)}
                              </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500">
                          Balance: {formatAmount(internalTargetAccount?.currentBalance || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SCAN & PAY QR */}
              {transferMode === "qr" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex justify-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setActiveQrView("scan")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeQrView === "scan"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Scan QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveQrView("my_qr")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        activeQrView === "my_qr"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      My Receive QR
                    </button>
                  </div>

                  {activeQrView === "scan" ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      {qrScanning ? (
                        <div className="flex flex-col items-center py-6">
                          <div className="relative size-44 rounded-2xl border-2 border-blue-500 bg-black/5 flex items-center justify-center overflow-hidden mb-3">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-bounce" />
                            <QrCode className="size-20 text-gray-400 animate-pulse" />
                          </div>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            Scanning QR viewfinder...
                          </p>
                        </div>
                      ) : qrScanned ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2">
                            <CheckCircle2 className="size-6" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Merchant QR Code Detected
                          </h4>
                          <p className="text-xs text-gray-500">Payee: Starbucks Coffee Outlet #4102</p>
                          <button
                            type="button"
                            onClick={() => setQrScanned(false)}
                            className="mt-3 text-xs text-blue-600 hover:underline cursor-pointer"
                          >
                            Rescan another QR
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-4">
                          <div className="size-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3">
                            <QrCode className="size-8" />
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                            Scan Any UPI / BharatQR Code
                          </h4>
                          <p className="text-xs text-gray-500 max-w-xs mb-4">
                            Simulate camera scanner or upload an image containing a payment QR code.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setQrScanning(true);
                              setTimeout(() => {
                                setQrScanning(false);
                                setQrScanned(true);
                                setBeneficiaryName("Starbucks Outlet #4102");
                                setCategory("Food & Dining");
                                setAmount("350");
                                toast.success("QR Code recognized: Starbucks Outlet (₹350)");
                              }, 1500);
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            Simulate Camera Scan
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-center">
                      <div className="p-4 rounded-xl bg-white shadow-md border border-gray-200 mb-3">
                        {/* Static QR illustration */}
                        <div className="size-36 bg-gray-900 rounded-lg flex items-center justify-center text-white p-2">
                          <QrCode className="size-32 text-white" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        {sourceAccount?.officialName || "My FinMan UPI"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">finman.user@okhdfcbank</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PHONE TRANSFER */}
              {transferMode === "phone" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="98765 43210"
                          value={phoneNumber}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setPhoneNumber(val);
                            if (val.length === 10 && !beneficiaryName) {
                              setBeneficiaryName("Aman Verma");
                            }
                          }}
                          required
                          className="w-full px-3.5 py-2.5 rounded-r-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aman Verma"
                        value={beneficiaryName}
                        onChange={(e) => setBeneficiaryName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Amount & Details */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Transfer Amount (₹)
                    </label>
                    <span className="text-xs text-gray-500">
                      Available: <span className="font-semibold text-gray-800 dark:text-gray-200">{formatAmount(sourceAccount?.currentBalance || 0)}</span>
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-2xl font-bold text-gray-400 font-ibm-plex-serif">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-2xl font-bold font-ibm-plex-serif text-gray-900 dark:text-gray-100 placeholder:text-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 transition cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>

                  {/* Preset Quick Amount Chips */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {AMOUNT_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleAmountPreset(p)}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-gray-700 dark:text-gray-300 transition cursor-pointer"
                      >
                        +₹{p.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Tagging & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Purpose / Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.icon} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Remarks / Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dinner share, Office rent"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Transfer Speed / Scheduling */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Execution Schedule
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferSpeed("instant")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        transferSpeed === "instant"
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <Zap className="size-3.5" /> Instant (IMPS)
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferSpeed("scheduled")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        transferSpeed === "scheduled"
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <Calendar className="size-3.5" /> Schedule Later
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferSpeed("recurring")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        transferSpeed === "recurring"
                          ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <Repeat className="size-3.5" /> Auto Recurring
                    </button>
                  </div>

                  {transferSpeed === "scheduled" && (
                    <div className="pt-2 animate-in fade-in-50">
                      <label className="text-[11px] font-semibold text-gray-500">Execution Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-xs font-medium text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  )}

                  {transferSpeed === "recurring" && (
                    <div className="pt-2 flex items-center gap-3 animate-in fade-in-50">
                      <span className="text-xs text-gray-500">Frequency:</span>
                      <button
                        type="button"
                        onClick={() => setRecurringFrequency("weekly")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          recurringFrequency === "weekly"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Weekly
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecurringFrequency("monthly")}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          recurringFrequency === "monthly"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  )}
                </div>

                {/* Save Beneficiary Toggle */}
                {transferMode !== "internal" && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="save-ben"
                      checked={saveAsBeneficiary}
                      onChange={(e) => setSaveAsBeneficiary(e.target.checked)}
                      className="size-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="save-ben" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                      Save this payee to my Favorite Beneficiaries list for 1-click transfers
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Continue to Security Review</span>
                    <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Live Summary, Security Info & Transfer Limits */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Real-time Transfer Summary Card */}
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-5 shadow-xs backdrop-blur-md">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
              <Receipt className="size-4 text-blue-600" />
              <span>Transfer Breakdown</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Source Account</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {sourceAccount?.name || "None"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Transfer Channel</span>
                <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                  {transferMode === "bank"
                    ? "IMPS / RTGS"
                    : transferMode === "upi"
                    ? "UPI Instant"
                    : transferMode === "internal"
                    ? "Self Transfer"
                    : transferMode === "qr"
                    ? "QR Scanner"
                    : "Mobile Transfer"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Transfer Amount</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 font-ibm-plex-serif">
                  {formatAmount(Number(amount) || 0)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Platform Transfer Fee</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹0.00 (Free)</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Settlement Time</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {transferSpeed === "instant" ? "Instant (Real-time)" : "On Scheduled Date"}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Total Debit</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400 font-ibm-plex-serif">
                  {formatAmount(Number(amount) || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Daily Limit & Security Card */}
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-gradient-to-br from-blue-50/50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="size-5 text-blue-600" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Daily Transfer Limits</h4>
            </div>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Daily Limit Used</span>
                  <span>₹25,000 / ₹2,00,000</span>
                </div>
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[12.5%]" />
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-gray-500">
                Transfers above ₹50,000 are verified via two-factor OTP authentication and monitored by automated
                anti-fraud checks.
              </p>
            </div>
          </div>

          {/* Help & Support Widget */}
          <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-4 shadow-xs flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
              <Info className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100">Need Transfer Help?</p>
              <p className="text-[11px] text-gray-500">Failed transactions are refunded within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transfers Feed & Quick Re-Send */}
      <div className="mt-12 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-5 sm:p-6 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Payment Transfers</h3>
            <p className="text-xs text-gray-500">View and repeat your recent payment transfers</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="size-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipient or amount..."
                value={transferSearch}
                onChange={(e) => setTransferSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <Link
              href="/transaction-history"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              View Full History →
            </Link>
          </div>
        </div>

        {recentTransfers.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            No past transfer records match your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Recipient / Note</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Channel</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {recentTransfers.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                          <ArrowUpRight className="size-4" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                          {t.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                        {t.category || "Transfer"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-gray-500 font-medium">{t.date}</td>

                    <td className="py-3.5 px-3 text-gray-600 dark:text-gray-400 capitalize">
                      {t.paymentChannel.replace("_", " ")}
                    </td>

                    <td className="py-3.5 px-3 font-bold font-ibm-plex-serif text-rose-600 dark:text-rose-400">
                      -{formatAmount(Math.abs(t.amount))}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3" /> Completed
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRepeatTransfer(t)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/60 dark:hover:text-blue-400 text-[11px] font-semibold text-gray-700 dark:text-gray-300 transition cursor-pointer"
                      >
                        <Repeat className="size-3" /> Repeat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECURITY PIN & REVIEW MODAL (2-STEP VERIFICATION) */}
      {/* ========================================================================= */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="mx-auto size-12 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Confirm Payment Authorization
              </h3>
              <p className="text-xs text-gray-500">
                Please verify the transaction details and enter your 4-digit Security PIN.
              </p>
            </div>

            {/* Transfer Details Card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-baseline border-b border-gray-200/60 dark:border-gray-800 pb-2">
                <span className="text-gray-500">Amount Payable</span>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400 font-ibm-plex-serif">
                  {formatAmount(Number(amount) || 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">From Account</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {sourceAccount?.name} (•••• {sourceAccount?.mask})
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Payee / Recipient</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                  {transferMode === "internal"
                    ? internalTargetAccount?.name
                    : beneficiaryName || targetAccount || upiId || phoneNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Transfer Type</span>
                <span className="font-semibold uppercase text-blue-600 dark:text-blue-400">
                  {transferMode} • {transferSpeed}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Fee / Charges</span>
                <span className="font-semibold text-emerald-600">₹0.00 (Zero Fee)</span>
              </div>
            </div>

            {/* 4-Digit PIN Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-center block text-gray-700 dark:text-gray-300">
                Enter 4-Digit Security Transaction PIN
              </label>

              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-${idx}`}
                    type="password"
                    maxLength={1}
                    value={securityPin[idx]}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(idx, e)}
                    autoFocus={idx === 0}
                    className={`size-12 text-center text-xl font-bold rounded-xl border bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 ${
                      pinError
                        ? "border-rose-500 focus:ring-rose-500/30"
                        : "border-gray-300 dark:border-gray-700 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-[11px] text-center font-semibold text-rose-600">
                  Please enter all 4 digits of your PIN.
                </p>
              )}

              {/* Biometric Simulation Quick Action */}
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSecurityPin(["1", "2", "3", "4"]);
                    toast.success("Biometric Fingerprint Verified ✓");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  <Fingerprint className="size-4" /> Use Biometric Touch ID
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" />
                    <span>Authorize Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIGITAL RECEIPT & SUCCESS MODAL */}
      {/* ========================================================================= */}
      {completedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header / Success Indicator */}
            <div className="text-center space-y-1">
              <div className="mx-auto size-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mb-3 shadow-md ring-8 ring-emerald-50 dark:ring-emerald-950/30">
                <CheckCircle2 className="size-8 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {completedTxn.isScheduled ? "Transfer Scheduled Successfully" : "Payment Successful!"}
              </h3>
              <p className="text-xs text-gray-500">
                Settled via NPCI Fast Settlement Network
              </p>
            </div>

            {/* Amount Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-semibold text-gray-500">Amount Sent</span>
              <h2 className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-ibm-plex-serif mt-0.5">
                {formatAmount(completedTxn.amount)}
              </h2>
            </div>

            {/* Receipt Details Table */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-200/60 dark:border-gray-800">
                <span className="text-gray-500">Reference ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200">
                    {completedTxn.refId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(completedTxn.refId);
                      setCopiedRef(true);
                      toast.success("Reference ID copied to clipboard!");
                      setTimeout(() => setCopiedRef(false), 2000);
                    }}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                    title="Copy"
                  >
                    {copiedRef ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-gray-800">
                <span className="text-gray-500">Sender Account</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {completedTxn.senderAccount.name} (•••• {completedTxn.senderAccount.mask})
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-gray-800">
                <span className="text-gray-500">Recipient</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[180px]">
                  {completedTxn.recipient}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-gray-800">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {completedTxn.date} at {completedTxn.time}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-200/60 dark:border-gray-800">
                <span className="text-gray-500">Category / Purpose</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {completedTxn.category}
                </span>
              </div>

              {completedTxn.note && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Note</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 italic">
                    "{completedTxn.note}"
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Receipt downloaded as PDF (simulation)");
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-3.5" /> Download PDF
                </button>

                <Link
                  href="/transaction-history"
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  View in History
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setCompletedTxn(null)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
              >
                Make Another Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
