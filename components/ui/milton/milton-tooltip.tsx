import { FC, ReactNode } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface MiltonTooltipProps {
  content: ReactNode;
}

export const MiltonTooltip: FC<MiltonTooltipProps> = ({ content }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="text-yellow-500 h-5 w-5 cursor-pointer" />
    </TooltipTrigger>
    <TooltipContent>
      <p>{content}</p>
    </TooltipContent>
  </Tooltip>
);