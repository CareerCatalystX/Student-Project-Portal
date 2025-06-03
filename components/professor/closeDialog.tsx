'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CloseProjectDialogProps {
  projectId: string;
  onProjectClosed?: () => void; // Optional callback for when project is closed
}

export default function CloseProjectDialog({ projectId, onProjectClosed }: CloseProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const router = useRouter()

  async function closeProject() {
    if (confirmationText !== 'CLOSE') {
      toast.error('Please type "CLOSE" to confirm');
      return;
    }

    const closePromise = async () => {
      const response = await fetch(`/api/projects/${projectId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to close project');
      }

      return response.json();
    };

    toast.promise(closePromise(), {
      loading: "Closing project...",
      success: (data) => {
        setIsOpen(false);
        setConfirmationText('');
        router.back();
        return "Project closed successfully.";
      },
      error: (err) => {
        console.error('Error closing project:', err);
        return `Failed to close project: ${err.message || 'Unknown error'}`;
      },
    });
  }

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmationText('');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Project Permanently</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type "CLOSE" to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Type CLOSE to confirm"
              onChange={(e) => setConfirmationText(e.target.value)}
              value={confirmationText}
              className="w-full"
            />
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleDialogClose(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={closeProject}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={confirmationText !== 'CLOSE'}
            >
              Close Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button
        onClick={() => setIsOpen(true)}
        className=" bg-red-300 text-red-700 hover:text-white hover:bg-red-600"
      >
        Close Project
      </Button>
    </>
  );
}