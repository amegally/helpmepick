'use client';

export function DebugEnv() {
  return (
    <div style={{ display: 'none' }}>
      <div id="debug-env" data-affiliate-id={process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID}>
        Environment Check
      </div>
    </div>
  );
} 