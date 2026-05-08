import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Document Upload' },
  { id: 3, label: 'Selfie Check' },
  { id: 4, label: 'Review' },
];

const documentTypes = [
  { id: 'passport', label: 'Passport', icon: 'ri-passport-line' },
  { id: 'idcard', label: 'National ID Card', icon: 'ri-id-card-line' },
  { id: 'license', label: 'Driver\'s License', icon: 'ri-steering-line' },
];

export default function KycPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [docType, setDocType] = useState('passport');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [agree, setAgree] = useState(false);

  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const handleFile = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setter(e.target.files[0]);
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return !!frontFile;
    if (currentStep === 3) return !!selfieFile;
    if (currentStep === 4) return agree;
    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <div className="border-b border-dark-700/50">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 shrink-0">
            <img
              src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
              alt="Ai EARNERS Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              Ai <span className="text-gold-400">EARNERS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors whitespace-nowrap items-center gap-1"
            >
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" />
              Dashboard
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Identity Verification</h1>
            <p className="text-sm text-white/50">
              Verify your identity to unlock higher withdrawal limits and earn a verified badge on your profile.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-0">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep >= s.id
                          ? 'bg-gold-500 text-dark-900'
                          : 'bg-dark-800 border border-dark-700/50 text-white/30'
                      }`}
                    >
                      {submitted && s.id === 4 ? (
                        <i className="ri-check-line w-4 h-4 flex items-center justify-center" />
                      ) : (
                        s.id
                      )}
                    </div>
                    <span
                      className={`text-[10px] transition-colors ${
                        currentStep >= s.id ? 'text-gold-400' : 'text-white/30'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-20 h-0.5 mx-1 md:mx-2 transition-colors ${
                        currentStep > s.id ? 'bg-gold-500' : 'bg-dark-700/50'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-surface-card border border-dark-700/40 rounded-xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-double-line text-emerald-400 text-2xl w-6 h-6 flex items-center justify-center" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Verification Submitted</h2>
                <p className="text-sm text-white/50 mb-6 max-w-md mx-auto">
                  Your documents have been sent for review. Our team typically processes verifications within 24-48 hours. You will receive a notification once approved.
                </p>
                <div className="bg-dark-800/60 border border-dark-700/30 rounded-lg p-4 mb-6 text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center text-gold-400" />
                    <span className="text-xs text-white font-medium">What happens next?</span>
                  </div>
                  <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
                    <li>Document authenticity check</li>
                    <li>Face match verification</li>
                    <li>Compliance screening</li>
                    <li>Badge activation on profile</li>
                  </ul>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/dashboard"
                    className="bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm"
                  >
                    Back to Dashboard
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="bg-dark-800 hover:bg-dark-700 border border-dark-700/40 text-white/70 hover:text-white px-6 py-2.5 rounded-md transition-colors text-sm"
                  >
                    Go to Settings
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-white font-semibold text-base mb-1">Personal Information</h3>
                      <p className="text-xs text-white/40">Confirm your details for regulatory compliance.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5">First Name</label>
                        <input
                          type="text"
                          defaultValue="Michael"
                          className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Turner"
                          className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5">Date of Birth</label>
                        <input
                          type="date"
                          defaultValue="1988-03-12"
                          className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5">Nationality</label>
                        <select className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors">
                          <option>United States</option>
                          <option>Germany</option>
                          <option>Japan</option>
                          <option>United Kingdom</option>
                          <option>India</option>
                          <option>Italy</option>
                          <option>Spain</option>
                          <option>France</option>
                          <option>UAE</option>
                          <option>Singapore</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Residential Address</label>
                      <textarea
                        defaultValue="742 Evergreen Terrace, Springfield"
                        rows={2}
                        maxLength={200}
                        className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Document Upload */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-white font-semibold text-base mb-1">Document Upload</h3>
                      <p className="text-xs text-white/40">Upload a clear photo of your chosen ID document.</p>
                    </div>

                    {/* Document Type Selector */}
                    <div className="flex flex-wrap gap-2">
                      {documentTypes.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDocType(d.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-md border text-xs transition-all whitespace-nowrap ${
                            docType === d.id
                              ? 'bg-gold-500/10 border-gold-400/30 text-gold-400'
                              : 'bg-dark-800 border-dark-700/40 text-white/50 hover:text-white/70'
                          }`}
                        >
                          <i className={`${d.icon} w-4 h-4 flex items-center justify-center`} />
                          {d.label}
                        </button>
                      ))}
                    </div>

                    {/* Front Upload */}
                    <div>
                      <label className="block text-xs text-white/50 mb-2">Front Side</label>
                      <button
                        onClick={() => frontRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors ${
                          frontFile
                            ? 'border-emerald-400/30 bg-emerald-500/5'
                            : 'border-dark-700/50 bg-dark-800/40 hover:border-gold-400/30'
                        }`}
                      >
                        {frontFile ? (
                          <>
                            <i className="ri-file-check-line text-emerald-400 text-xl w-6 h-6 flex items-center justify-center" />
                            <span className="text-sm text-emerald-400 font-medium">{frontFile.name}</span>
                            <span className="text-[10px] text-white/30">{(frontFile.size / 1024).toFixed(0)} KB</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-cloud-2-line text-white/20 text-xl w-6 h-6 flex items-center justify-center" />
                            <span className="text-sm text-white/40">Click to upload front side</span>
                            <span className="text-[10px] text-white/25">JPG, PNG or PDF up to 10MB</span>
                          </>
                        )}
                      </button>
                      <input ref={frontRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile(setFrontFile)} />
                    </div>

                    {/* Back Upload */}
                    <div>
                      <label className="block text-xs text-white/50 mb-2">Back Side</label>
                      <button
                        onClick={() => backRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-2 transition-colors ${
                          backFile
                            ? 'border-emerald-400/30 bg-emerald-500/5'
                            : 'border-dark-700/50 bg-dark-800/40 hover:border-gold-400/30'
                        }`}
                      >
                        {backFile ? (
                          <>
                            <i className="ri-file-check-line text-emerald-400 text-xl w-6 h-6 flex items-center justify-center" />
                            <span className="text-sm text-emerald-400 font-medium">{backFile.name}</span>
                          </>
                        ) : (
                          <>
                            <i className="ri-upload-cloud-2-line text-white/20 text-xl w-6 h-6 flex items-center justify-center" />
                            <span className="text-sm text-white/40">Click to upload back side</span>
                            <span className="text-[10px] text-white/25">Optional for passports</span>
                          </>
                        )}
                      </button>
                      <input ref={backRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile(setBackFile)} />
                    </div>

                    <div className="bg-gold-500/5 border border-gold-400/10 rounded-md p-3 flex items-start gap-2">
                      <i className="ri-information-line w-4 h-4 flex items-center justify-center text-gold-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-white/50">
                        Ensure all corners of the document are visible, text is readable, and there is no glare or blur.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Selfie */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-white font-semibold text-base mb-1">Selfie Verification</h3>
                      <p className="text-xs text-white/40">Take a clear photo of your face to match your ID document.</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-full bg-dark-800 border-2 border-dashed border-dark-700/50 flex items-center justify-center overflow-hidden">
                        {selfieFile ? (
                          <img
                            src={URL.createObjectURL(selfieFile)}
                            alt="Selfie preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="ri-user-smile-line text-white/15 text-4xl w-10 h-10 flex items-center justify-center" />
                        )}
                      </div>

                      <button
                        onClick={() => selfieRef.current?.click()}
                        className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700/40 text-white/70 hover:text-white px-5 py-2.5 rounded-md transition-colors text-sm"
                      >
                        <i className="ri-camera-line w-4 h-4 flex items-center justify-center" />
                        {selfieFile ? 'Retake Selfie' : 'Upload Selfie'}
                      </button>
                      <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFile(setSelfieFile)} />
                    </div>

                    <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4">
                      <h4 className="text-xs text-white font-medium mb-2">Tips for a perfect selfie:</h4>
                      <ul className="text-xs text-white/50 space-y-1.5 list-disc list-inside">
                        <li>Face the camera directly with neutral lighting</li>
                        <li>Keep a plain background behind you</li>
                        <li>Do not wear sunglasses, hats, or masks</li>
                        <li>Make sure your face fills most of the frame</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-white font-semibold text-base mb-1">Review & Submit</h3>
                      <p className="text-xs text-white/40">Confirm your details before submitting for verification.</p>
                    </div>

                    <div className="bg-dark-800/40 border border-dark-700/30 rounded-lg p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Name</span>
                        <span className="text-sm text-white">Michael Turner</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Document</span>
                        <span className="text-sm text-white">{documentTypes.find((d) => d.id === docType)?.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Front Uploaded</span>
                        <span className="text-sm text-emerald-400 flex items-center gap-1">
                          <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center" />
                          Yes
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Selfie Uploaded</span>
                        <span className="text-sm text-emerald-400 flex items-center gap-1">
                          <i className="ri-check-line w-3.5 h-3.5 flex items-center justify-center" />
                          Yes
                        </span>
                      </div>
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-gold-500"
                      />
                      <span className="text-xs text-white/50">
                        I confirm that all information provided is accurate and I consent to identity verification processing in accordance with platform policies.
                      </span>
                    </label>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-dark-700/30 mt-2">
                  <button
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                    className="text-sm text-white/50 hover:text-white disabled:opacity-30 disabled:hover:text-white/50 transition-colors flex items-center gap-1"
                  >
                    <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
                    Back
                  </button>
                  {currentStep < 4 ? (
                    <button
                      onClick={() => setCurrentStep((s) => s + 1)}
                      disabled={!canProceed()}
                      className="bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm flex items-center gap-1"
                    >
                      Continue
                      <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canProceed()}
                      className="bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 font-semibold px-6 py-2.5 rounded-md transition-colors text-sm flex items-center gap-2"
                    >
                      <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center" />
                      Submit Verification
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}