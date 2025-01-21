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

interface CloseProjectDialogProps {
  projectId: string;
}

export default function CloseProjectDialog({ projectId }: CloseProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const closeProject = async () => {
    if (confirmationText !== 'CLOSE') {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`/api/projects/${projectId}/close`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to close project');
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error closing project:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Project Permanently</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type CLOSE to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Type CLOSE to confirm"
            onChange={(e) => setConfirmationText(e.target.value)}
            value={confirmationText}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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