"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Service, Staff } from "@/types";

interface BookingState {
  selectedService?: Service;
  selectedStaff?: Staff;
  selectedDate?: string;
  selectedTime?: string;
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  step: "services" | "staff" | "time" | "details";
}

type BookingAction =
  | { type: "SELECT_SERVICE"; service: Service }
  | { type: "SELECT_STAFF"; staff: Staff }
  | { type: "SELECT_DATE_TIME"; date: string; time: string }
  | { type: "SET_CLIENT_INFO"; info: BookingState["clientInfo"] }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "RESET" };

const initialState: BookingState = {
  step: "services",
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SELECT_SERVICE":
      return {
        ...state,
        selectedService: action.service,
      };
    case "SELECT_STAFF":
      return {
        ...state,
        selectedStaff: action.staff,
      };
    case "SELECT_DATE_TIME":
      return {
        ...state,
        selectedDate: action.date,
        selectedTime: action.time,
      };
    case "SET_CLIENT_INFO":
      return {
        ...state,
        clientInfo: action.info,
      };
    case "NEXT_STEP":
      const steps: BookingState["step"][] = ["services", "staff", "time", "details"];
      const currentIndex = steps.indexOf(state.step);
      return {
        ...state,
        step: steps[currentIndex + 1] as BookingState["step"],
      };
    case "PREVIOUS_STEP":
      const prevSteps: BookingState["step"][] = ["services", "staff", "time", "details"];
      const prevIndex = prevSteps.indexOf(state.step);
      return {
        ...state,
        step: prevSteps[prevIndex - 1] as BookingState["step"],
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}