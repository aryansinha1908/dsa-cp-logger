"use client";

import React, { useEffect, useRef } from "react";
import { useTour } from "./tour-provider";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface TourStepProps {
  step: number;
  title: string;
  content: string;
  anchorName: string;
  positionArea?: string;
}

export function TourStep({ step, title, content, anchorName, positionArea = "bottom center" }: TourStepProps) {
  const { currentStep, isActive, nextStep, prevStep, endTour, totalSteps } = useTour();
  const popoverRef = useRef<HTMLDivElement>(null);

  const isCurrentStep = isActive && currentStep === step;

  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    if (isCurrentStep) {
      try {
        if (!el.matches(':popover-open')) {
          el.showPopover();
        }
        // Shift programmatic focus inside the popover
        const nextBtn = el.querySelector<HTMLButtonElement>('.tour-next-btn');
        if (nextBtn) nextBtn.focus();
      } catch (e) {
        console.error("Failed to show popover", e);
      }
    } else {
      try {
        if (el.matches(':popover-open')) {
          el.hidePopover();
        }
      } catch (e) {}
    }
  }, [isCurrentStep]);

  if (!isCurrentStep) return null;

  return (
    <div
      ref={popoverRef}
      id={`tour-step-${step}`}
      popover="manual"
      role="dialog"
      aria-labelledby={`tour-title-${step}`}
      className="tour-popover z-50 w-72 p-4 rounded-xl border border-white/20 bg-card/95 backdrop-blur-xl shadow-2xl text-card-foreground m-0 pointer-events-auto"
      style={{
        positionAnchor: anchorName,
        positionArea: positionArea,
      } as any}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 id={`tour-title-${step}`} className="font-semibold text-lg text-foreground">
          {title}
        </h3>
        <button 
          onClick={endTour}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close tour"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {content}
      </p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <span className="text-xs text-muted-foreground font-medium">
          Step {step} of {totalSteps}
        </span>
        <div className="flex gap-2">
          {step > 1 && (
            <Button variant="ghost" size="sm" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={nextStep} 
            className="tour-next-btn bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === totalSteps ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
