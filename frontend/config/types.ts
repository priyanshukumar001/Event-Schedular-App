import { createContext } from "react";

// Type definitions
export interface Attendee {
    name: string;
    email: string;
  }
  
  export interface Slot {
    _id: string;
    start: string;
    end: string;
    duration: number;
  }
  
  export interface ScheduledSlot extends Slot {
    attendees: Attendee[];
    userName?: string;
  }
  
  export interface User {
    _id: string;
    name: string;
    user: string;
    availableSlots: Slot[];
    scheduledSlots: ScheduledSlot[];
  }
  
  // Create context for verification with proper types
  interface VerifyContextType {
    isVerified: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmin: boolean;
    setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const VerifyContext = createContext<VerifyContextType>({
    isVerified: false,
    setIsVerified: () => {},
    isAdmin: false,
    setIsAdmin: () => {},
  });