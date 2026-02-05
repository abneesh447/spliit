import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormState } from 'react-hook-form';
export function SubmitButton({ children, loadingContent, ...props }) {
    const { isSubmitting } = useFormState();
    return (<Button type="submit" disabled={isSubmitting} {...props}>
      {isSubmitting ? (<>
          <Loader2 className="w-4 h-4 mr-2 animate-spin"/> {loadingContent}
        </>) : (children)}
    </Button>);
}
