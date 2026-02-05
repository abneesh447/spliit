'use client';
import { Button } from '@/components/ui/button';
import { Share } from 'lucide-react';
import { useEffect, useState } from 'react';
export function ShareUrlButton({ url, text, title }) {
    const canShare = useCanShare(url, text);
    if (!canShare)
        return null;
    return (<Button size="icon" variant="secondary" type="button" title={title} onClick={() => {
            if (navigator.share) {
                navigator.share({ text, url });
            }
            else {
                console.log('Sharing is not available', { text, url });
            }
        }}>
      <Share className="w-4 h-4"/>
    </Button>);
}
function useCanShare(url, text) {
    const [canShare, setCanShare] = useState(null);
    useEffect(() => {
        setCanShare(navigator.share !== undefined && navigator.canShare({ url, text }));
    }, [text, url]);
    return canShare;
}
