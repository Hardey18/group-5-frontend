"use client";

import { useState } from "react";
import { api } from "@/lib/api/axios";
import { FollowUpMessageDTO, MessageType, ApiResponse } from "@/types/followup";

export function useFollowUp() {
  const [step, setStep] = useState<number>(0);
  const [callId, setCallId] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("SMS");
  const [message, setMessage] = useState<FollowUpMessageDTO | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const clearToast = () => {
    setError(null);
    setSuccessToast(null);
  };

  const generateFollowUp = async () => {
    clearToast();
    setIsGenerating(true);
    try {
      if (!callId.trim()) throw new Error("Call ID is required.");
      await new Promise(r => setTimeout(r, 1000));
      setMessage({
        id: "msg-abcd-1234",
        callId: callId.trim(),
        type: messageType,
        content: "Dear Client,\n\nFollowing our call regarding your internet drops, we have reset the routing protocols on your neighborhood node. Please let us know if the issue persists.\n\nRegards,\nSupport Team",
        isApproved: false,
        sentAt: null,
        deliveryStatus: "Pending"
      });
      setStep(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const approveFollowUp = async () => {
    clearToast();
    if (!message) return;
    setIsApproving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      setMessage({ ...message, isApproved: true });
      setSuccessToast("Message approved successfully!");
      setTimeout(() => setStep(2), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsApproving(false);
    }
  };

  const sendFollowUp = async () => {
    clearToast();
    if (!message) return;
    setIsSending(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMessage({ 
        ...message, 
        deliveryStatus: "Delivered", 
        sentAt: new Date().toISOString()
      });
      setSuccessToast(`Your ${message.type || 'message'} has been delivered successfully.`);
      setStep(3); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const reset = () => {
    setStep(0);
    setCallId("");
    setMessageType("SMS");
    setMessage(null);
    clearToast();
  };

  return {
    step,
    setStep,
    callId,
    setCallId,
    messageType,
    setMessageType,
    message,
    error,
    successToast,
    clearToast,

    generateFollowUp,
    approveFollowUp,
    sendFollowUp,
    reset,

    isGenerating,
    isApproving,
    isSending
  };
}
