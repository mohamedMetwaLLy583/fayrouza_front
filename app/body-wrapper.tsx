'use client';

import { useI18n } from '@/lib/i18n/context';
import { ReactNode } from 'react';

export default function BodyWrapper({ children }: { children: ReactNode }) {
  const { dir } = useI18n();
  
  return (
    <body
      dir={dir}
      className="font-ibm-plex-sans-arabic"
    >
      {children}
    </body>
  );
}