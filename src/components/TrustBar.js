export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container trust-bar-in">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Enterprise Compliance &amp; Standards:</span>
        </div>

        <div className="cert-list">
          <div className="cert-item text-xs">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>BIFMA X5.1 Tested Spares</span>
          </div>

          <div className="cert-item text-xs">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>ISO 9001:2015 Quality Process</span>
          </div>

          <div className="cert-item text-xs">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Zero-Downtime Weekend Batches</span>
          </div>

          <div className="cert-item text-xs">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>GST Input Tax Credit &amp; MSME</span>
          </div>
        </div>
      </div>
    </div>
  );
}
