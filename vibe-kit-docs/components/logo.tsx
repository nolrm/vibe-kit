export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2b62ef" />
          <stop offset="100%" stopColor="#4d79f0" />
        </linearGradient>
      </defs>
      
      <rect width="32" height="32" rx="4" fill="url(#logoGradient)" />
      <text 
        x="16" 
        y="22" 
        fontFamily="monospace" 
        fontSize="20" 
        fontWeight="bold" 
        fill="white" 
        textAnchor="middle"
      >
        VK
      </text>
    </svg>
  )
}

