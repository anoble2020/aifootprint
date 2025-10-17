import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { Share2, Copy, Mail, MessageSquare, Linkedin } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SharePopover = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const currentUrl = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link copied!",
        description: "The page URL has been copied to your clipboard.",
      });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = "Check out AI Footprint Tracker";
    const body = `I found this interesting tool that tracks the environmental impact of AI usage: ${currentUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
    setOpen(false);
  };

  const shareViaSMS = () => {
    const message = `Check out this AI environmental impact tracker: ${currentUrl}`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
    setOpen(false);
  };

  const shareViaLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white border shadow-lg" align="end" style={{ zIndex: 10001 }}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Share AI Footprint Tracker</h4>
            <p className="text-xs text-gray-600 mb-3">
              Help others understand their AI environmental impact
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 text-xs bg-transparent border-none outline-none"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaEmail}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Mail className="h-4 w-4" />
              <span className="text-xs">Email</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaSMS}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">SMS</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaLinkedIn}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SharePopover;
