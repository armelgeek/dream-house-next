'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Phone, User } from 'lucide-react';
import { toast } from 'sonner';
import type { PropertyWithOwner } from '../../config/property.schema';

interface PropertyContactProps {
  property: PropertyWithOwner;
  className?: string;
}

export function PropertyContact({ property, className }: PropertyContactProps) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: property.ownerId,
          propertyId: property.id,
          content: messageText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully!');
      setMessageText('');
      setMessageOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleRequestCall = () => {
    // Pre-fill message with call request
    setMessageText(`Hi! I'm interested in your property "${property.title}" and would like to schedule a call to discuss it further. Please let me know when would be a good time for you.`);
    setMessageOpen(true);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Contact Owner
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Owner Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={property.owner.image || ''} alt={property.owner.name} />
            <AvatarFallback>
              {property.owner.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{property.owner.name}</div>
            <div className="text-sm text-muted-foreground">Property Owner</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Send Message to {property.owner.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  About: <span className="font-medium">{property.title}</span>
                </div>
                
                <Textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={4}
                  disabled={sending}
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sending || !messageText.trim()}
                    className="flex-1"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setMessageOpen(false)}
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={handleRequestCall}
          >
            <Phone className="w-4 h-4 mr-2" />
            Request Call
          </Button>
        </div>

        {/* Quick Message Templates */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Quick messages:</div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-auto p-2"
              onClick={() => {
                setMessageText(`Hi! I'm interested in viewing the property "${property.title}". When would be a good time to schedule a visit?`);
                setMessageOpen(true);
              }}
            >
              Schedule a viewing
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-auto p-2"
              onClick={() => {
                setMessageText(`Hello! I'd like to know more details about "${property.title}". Could you please provide additional information?`);
                setMessageOpen(true);
              }}
            >
              Request more details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-auto p-2"
              onClick={() => {
                setMessageText(`Hi! I'm interested in making an offer for "${property.title}". Could we discuss the terms?`);
                setMessageOpen(true);
              }}
            >
              Make an offer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}