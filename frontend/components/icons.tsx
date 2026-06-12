// Diamond icon for nav and header
export function DiamondIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2L22 12L12 22L2 12L12 2Z"
        fill="url(#diamondGrad)"
        stroke="rgba(99, 102, 241, 0.5)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

// Box/Cube icon for track order
export function BoxIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L21 6V12L12 16L3 12V6L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M12 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 6L12 10M3 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Refresh/Arrow icon for return policy
export function RefreshIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12C4 7.58 7.58 4 12 4C15.1 4 17.78 5.71 19.1 8.26M4 12C4 16.42 7.58 20 12 20C8.9 20 6.22 18.29 4.9 15.74"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M2 12H5M22 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Truck icon for shipping
export function TruckIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="12" height="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M14 12V8H20L22 12V14H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// Minimize icon
export function MinimizeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Close icon
export function CloseIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
