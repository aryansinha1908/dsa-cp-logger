"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TourContextType {
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  setTotalSteps: (total: number) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  return (
    <TourContext.Provider
      value={{
        currentStep,
        totalSteps,
        isActive,
        startTour,
        nextStep,
        prevStep,
        endTour,
        setTotalSteps,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
