"use client";

import React, { useState } from "react";
import { UploadCloud, Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated?: (jobData: any) => void;
}

export function CreateJobModal({ open, onOpenChange, onJobCreated }: CreateJobModalProps) {
  const [jobTitle, setJobTitle] = useState("Fix React Login Authentication");
  const [platform, setPlatform] = useState("Upwork");
  const [contractType, setContractType] = useState("Fixed Price");
  const [clientRef, setClientRef] = useState("");
  const [bugDescription, setBugDescription] = useState(
    "Login button does not work. API returns 401 error and users cannot access the dashboard."
  );
  const [repoUrl, setRepoUrl] = useState("https://github.com/client/project");
  const [expectedResult, setExpectedResult] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      toast.error("Silakan masukkan Job Title.");
      return;
    }

    const payload = {
      title: jobTitle,
      platform,
      contractType,
      clientRef: clientRef || "Client internal reference",
      bugDescription,
      repoUrl,
      expectedResult,
      attachment: selectedFile,
    };

    if (onJobCreated) {
      onJobCreated(payload);
    }

    toast.success(`Job "${jobTitle}" berhasil dibuat dan antrean AI disiapkan!`);
    onOpenChange(false);
  };

  const handleSimulateUpload = () => {
    setSelectedFile("error_screenshot_401.png");
    toast.info("File lampiran 'error_screenshot_401.png' berhasil dipilih!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[8px] p-0 bg-white border border-[#E7E5E4] overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E5E4] bg-[#FAF9F9]">
          <DialogTitle className="text-lg font-semibold tracking-tight text-[#1C1917]">
            Create New Job
          </DialogTitle>
          <DialogDescription className="text-xs text-[#78716C] mt-0.5">
            Formulir inisialisasi job AI bug fixing terstandarisasi untuk client.
          </DialogDescription>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 text-xs">
          {/* Job Title */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Job Title
            </label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Fix React Login Authentication"
              className="bg-[#FAF9F9] h-9.5 text-xs rounded-[6px]"
              required
            />
          </div>

          {/* Platform & Contract Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Platform
              </label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full h-9.5 px-3.5 pr-8 appearance-none rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
                >
                  <option value="Upwork">Upwork</option>
                  <option value="Fiverr">Fiverr</option>
                  <option value="Direct Contract">Direct Contract</option>
                  <option value="Internal Client">Internal Client</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
                <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
                Contract Type
              </label>
              <div className="relative">
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full h-9.5 px-3.5 pr-8 appearance-none rounded-[6px] bg-[#FAF9F9] border border-[#E7E5E4] text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
                >
                  <option value="Fixed Price">Fixed Price</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Milestone">Milestone</option>
                  <option value="Retainer">Retainer</option>
                </select>
                <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Client Name / Reference */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Client Name / Reference
            </label>
            <Input
              value={clientRef}
              onChange={(e) => setClientRef(e.target.value)}
              placeholder="Client username or internal reference"
              className="bg-[#FAF9F9] h-9.5 text-xs rounded-[6px]"
            />
          </div>

          {/* Bug Description */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Bug Description
            </label>
            <Textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Deskripsikan gejala error, kode HTTP, atau kendala..."
              className="min-h-[85px] leading-relaxed resize-y"
              required
            />
          </div>

          {/* Repository URL */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Repository URL
            </label>
            <Input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/client/project"
              className="bg-[#FAF9F9] h-9.5 text-xs rounded-[6px] font-mono"
              required
            />
          </div>

          {/* Client Requirements / Expected Result */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Client Requirements / Expected Result
            </label>
            <Textarea
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="Describe what the client expects..."
              className="min-h-[75px] leading-relaxed resize-y"
            />
          </div>

          {/* Attachments Upload Area */}
          <div>
            <label className="text-xs font-semibold text-[#1C1917] block mb-1.5">
              Attachments
            </label>
            <div
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-[#E7E5E4] hover:border-[#881337]/50 rounded-[8px] bg-[#FAF9F9] hover:bg-rose-50/20 transition-all p-5 text-center cursor-pointer flex flex-col items-center justify-center space-y-1.5"
            >
              <div className="size-8 rounded-full bg-white border border-[#E7E5E4] flex items-center justify-center shadow-2xs">
                <UploadCloud className="size-4 text-[#881337]" />
              </div>
              <span className="text-xs font-semibold text-[#1C1917]">
                {selectedFile ? `File terpilih: ${selectedFile}` : "Upload screenshots, logs, or files"}
              </span>
              <span className="text-[11px] text-[#78716C]">
                {selectedFile ? "Klik untuk mengganti file" : "Conceptual upload area (PNG, JPG, LOG, ZIP)"}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="default"
              className="w-full h-11 text-sm font-semibold rounded-[6px]"
            >
              Create Job (Preview)
            </Button>
            <p className="text-[11px] text-center text-[#78716C] mt-2">
              Contoh rancangan form, terhubung langsung ke antrean task AI workspace.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
