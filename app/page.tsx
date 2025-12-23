'use client';
import AlphaDXInterface from "./alphadx-ui";
import { useAuth } from "./auth-context";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  return <AlphaDXInterface />;
}
