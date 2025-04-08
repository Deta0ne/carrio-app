import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MockDataIndicator = memo(() => (
    <div className="absolute right-6 top-6">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 px-1.5 py-0">
                            <Database className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">Mock Data</span>
                        </Badge>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Currently using mock data for development</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    </div>
));

MockDataIndicator.displayName = 'MockDataIndicator';

export default MockDataIndicator;
